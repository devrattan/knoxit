// artifacts/api-server/src/routes/splitVote.ts
//
// The "Split the Vault" feature (designed 25 Jul 2026):
//   - Unlocks once a league has <= 5 alive survivors (fixed threshold,
//     same for every league)
//   - Any alive survivor can propose a split at any time once eligible
//   - Every alive survivor must agree; a single decline fails the vote
//   - On success: vault is divided evenly among alive survivors, paid out
//     via the chip ledger, and the league is marked "split" (no further
//     eliminations — game over for this league)
//   - On failure: league continues normally; can be proposed again next
//     gameweek (not immediately, to avoid vote spam mid-gameweek)

import { Router } from "express";
import { eq, and } from "drizzle-orm";
import { db } from "@db/index";
import { leagues, leagueMembers, splitVotes, splitVoteResponses, users } from "@db/schema";
import { proposeSplitSchema, castSplitVoteSchema } from "@api-zod/knoxit-schemas";
import { applyChipTransaction } from "../lib/chipLedger";

export const splitVoteRouter = Router();

const SPLIT_ELIGIBLE_MAX_ALIVE = 5;

// ---------------------------------------------------------------------------
// POST /api/leagues/:id/split/propose
// ---------------------------------------------------------------------------

splitVoteRouter.post("/:id/split/propose", async (req, res) => {
  const parsed = proposeSplitSchema.safeParse({ leagueId: req.params.id });
  if (!parsed.success) return res.status(400).json({ error: "Invalid league id" });

  const userId = req.userId as string;
  const leagueId = parsed.data.leagueId;

  const [league] = await db.select().from(leagues).where(eq(leagues.id, leagueId));
  if (!league) return res.status(404).json({ error: "League not found" });
  if (league.status !== "active") return res.status(400).json({ error: "League is not active" });

  const aliveMembers = await db
    .select({ userId: leagueMembers.userId })
    .from(leagueMembers)
    .where(and(eq(leagueMembers.leagueId, leagueId), eq(leagueMembers.status, "alive")));

  if (aliveMembers.length > SPLIT_ELIGIBLE_MAX_ALIVE) {
    return res.status(400).json({
      error: `Split unlocks at ${SPLIT_ELIGIBLE_MAX_ALIVE} or fewer survivors (currently ${aliveMembers.length})`,
    });
  }

  const isAlive = aliveMembers.some((m) => m.userId === userId);
  if (!isAlive) return res.status(403).json({ error: "Only alive survivors can propose a split" });

  const [existingVote] = await db
    .select()
    .from(splitVotes)
    .where(and(eq(splitVotes.leagueId, leagueId), eq(splitVotes.status, "voting")));
  if (existingVote) return res.status(400).json({ error: "A split vote is already in progress" });

  const [failedThisGameweek] = await db
    .select()
    .from(splitVotes)
    .where(
      and(
        eq(splitVotes.leagueId, leagueId),
        eq(splitVotes.status, "failed"),
        eq(splitVotes.gameweek, league.currentGameweek)
      )
    );
  if (failedThisGameweek) {
    return res.status(400).json({
      error: "A split already failed this gameweek. It can be proposed again next gameweek.",
    });
  }

  const [vote] = await db
    .insert(splitVotes)
    .values({
      leagueId,
      gameweek: league.currentGameweek,
      proposedBy: userId,
      status: "voting",
      vaultAtProposal: league.vaultChips,
    })
    .returning();

  // Seed a response row per alive survivor — proposer auto-agrees.
  await db.insert(splitVoteResponses).values(
    aliveMembers.map((m) => ({
      splitVoteId: vote.id,
      userId: m.userId,
      response: m.userId === userId ? ("agreed" as const) : ("pending" as const),
      respondedAt: m.userId === userId ? new Date() : null,
    }))
  );

  await maybeResolveSplitVote(vote.id);

  res.status(201).json(await getSplitVoteDetail(vote.id));
});

// ---------------------------------------------------------------------------
// POST /api/split/:id/vote — cast a vote (agree/decline)
// ---------------------------------------------------------------------------

splitVoteRouter.post("/split/:id/vote", async (req, res) => {
  const parsed = castSplitVoteSchema.safeParse({
    splitVoteId: req.params.id,
    response: req.body?.response,
  });
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
  }

  const userId = req.userId as string;
  const { splitVoteId, response } = parsed.data;

  const [vote] = await db.select().from(splitVotes).where(eq(splitVotes.id, splitVoteId));
  if (!vote) return res.status(404).json({ error: "Split vote not found" });
  if (vote.status !== "voting") return res.status(400).json({ error: "This vote is no longer open" });

  const [existingResponse] = await db
    .select()
    .from(splitVoteResponses)
    .where(and(eq(splitVoteResponses.splitVoteId, splitVoteId), eq(splitVoteResponses.userId, userId)));
  if (!existingResponse) return res.status(403).json({ error: "You're not eligible to vote on this" });

  await db
    .update(splitVoteResponses)
    .set({ response, respondedAt: new Date() })
    .where(and(eq(splitVoteResponses.splitVoteId, splitVoteId), eq(splitVoteResponses.userId, userId)));

  await maybeResolveSplitVote(splitVoteId);

  res.json(await getSplitVoteDetail(splitVoteId));
});

// ---------------------------------------------------------------------------
// GET /api/split/:id — current vote state (for the League Detail screen)
// ---------------------------------------------------------------------------

splitVoteRouter.get("/split/:id", async (req, res) => {
  const detail = await getSplitVoteDetail(req.params.id);
  if (!detail) return res.status(404).json({ error: "Split vote not found" });
  res.json(detail);
});

// ---------------------------------------------------------------------------
// Resolution logic
// ---------------------------------------------------------------------------

async function maybeResolveSplitVote(splitVoteId: string) {
  const responses = await db
    .select()
    .from(splitVoteResponses)
    .where(eq(splitVoteResponses.splitVoteId, splitVoteId));

  const anyDeclined = responses.some((r) => r.response === "declined");
  const allAgreed = responses.every((r) => r.response === "agreed");

  if (anyDeclined) {
    await db
      .update(splitVotes)
      .set({ status: "failed", resolvedAt: new Date() })
      .where(eq(splitVotes.id, splitVoteId));
    return;
  }

  if (allAgreed) {
    const [vote] = await db.select().from(splitVotes).where(eq(splitVotes.id, splitVoteId));
    const share = Math.floor(vote.vaultAtProposal / responses.length);

    for (const r of responses) {
      await applyChipTransaction({
        userId: r.userId,
        leagueId: vote.leagueId,
        type: "split_payout",
        amount: share,
        note: `Vault split — league ended by unanimous agreement`,
      });
    }

    await db
      .update(splitVotes)
      .set({ status: "passed", resolvedAt: new Date() })
      .where(eq(splitVotes.id, splitVoteId));

    await db.update(leagues).set({ status: "split" }).where(eq(leagues.id, vote.leagueId));
  }
  // Otherwise still waiting on pending votes — no action.
}

async function getSplitVoteDetail(splitVoteId: string) {
  const [vote] = await db.select().from(splitVotes).where(eq(splitVotes.id, splitVoteId));
  if (!vote) return null;

  const responses = await db
    .select({
      userId: splitVoteResponses.userId,
      username: users.username,
      response: splitVoteResponses.response,
    })
    .from(splitVoteResponses)
    .innerJoin(users, eq(splitVoteResponses.userId, users.id))
    .where(eq(splitVoteResponses.splitVoteId, splitVoteId));

  return {
    id: vote.id,
    leagueId: vote.leagueId,
    status: vote.status,
    vaultAtProposal: vote.vaultAtProposal,
    responses,
  };
}
