// artifacts/api-server/src/routes/leagues.ts
//
// Assumes an auth middleware upstream attaches `req.userId` (decoded from
// the Supabase Auth JWT). Adjust the import paths below to match your
// actual lib/db and lib/api-zod locations.

import { Router } from "express";
import { eq, and, count, sql } from "drizzle-orm";
import { db } from "@db/index";
import { leagues, leagueMembers } from "@db/schema";
import {
  createLeagueSchema,
  joinLeagueSchema,
} from "@api-zod/knoxit-schemas";
import { applyChipTransaction, InsufficientChipsError } from "../lib/chipLedger";

export const leaguesRouter = Router();

// ---------------------------------------------------------------------------
// POST /api/leagues — create a league (competitive admin tool, or a user
// creating a Friends League)
// ---------------------------------------------------------------------------

leaguesRouter.post("/", async (req, res) => {
  const parsed = createLeagueSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
  }
  const input = parsed.data;
  const userId = req.userId as string;

  if (input.type === "competitive" && input.entryTerms) {
    // Entry terms are a Friends League concept only — competitive leagues
    // use the standard chip entry fee, no free-text stakes description.
    return res.status(400).json({ error: "entryTerms only applies to friends leagues" });
  }

  // Friends Leagues have neither an entry fee nor a member cap (25 Jul 2026
  // decision) — force these regardless of what the client sent, rather
  // than trusting client input for something this consequential.
  // Competitive leagues require both (entry fee can be 0, but maxMembers
  // must be set — defaults to 20 if not provided).
  const entryFeeChips = input.type === "friends" ? 0 : (input.entryFeeChips ?? 0);
  const maxMembers = input.type === "friends" ? null : (input.maxMembers ?? 20);

  // Friends League names must be unique (case-insensitive) — decided 25 Jul 2026.
  // Doesn't apply to competitive leagues, which intentionally reuse the same
  // base name across many concurrent instances (distinguished by `code`).
  if (input.type === "friends") {
    const [nameClash] = await db
      .select({ id: leagues.id })
      .from(leagues)
      .where(and(eq(leagues.type, "friends"), sql`lower(${leagues.name}) = lower(${input.name})`));
    if (nameClash) {
      return res.status(409).json({ error: "A friends league with this name already exists. Try a different name." });
    }
  }

  const code = await generateLeagueCode(input.sport, input.type);
  const inviteCode = input.type === "friends" ? await generateUniqueInviteCode() : null;

  const [league] = await db
    .insert(leagues)
    .values({
      code,
      inviteCode,
      name: input.name,
      sport: input.sport,
      type: input.type,
      visibility: input.visibility,
      status: "upcoming",
      createdBy: userId,
      entryFeeChips,
      vaultChips: 0,
      maxMembers,
      entryTerms: input.entryTerms ?? null,
      locksAt: input.locksAt ? new Date(input.locksAt) : null,
    })
    .returning();

  // Creator auto-joins their own league and is always an admin.
  await joinLeagueInternal(league.id, userId, { isAdmin: true });

  res.status(201).json({
    id: league.id,
    code: league.code,
    name: league.name,
    inviteCode: league.inviteCode,
  });
});

/**
 * Generates a random, non-guessable invite code for Friends Leagues
 * (distinct from the sequential display `code` like "WW-1" — that one's
 * predictable on purpose for readability; this one must NOT be, since
 * knowing it grants instant join with no approval step). Retries on the
 * astronomically unlikely event of a collision.
 */
async function generateUniqueInviteCode(): Promise<string> {
  // Excludes ambiguous characters (0/O, 1/I/L) so codes are easy to read
  // and type out loud or share via text without confusion.
  const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const CODE_LENGTH = 6;

  for (let attempt = 0; attempt < 5; attempt++) {
    let code = "";
    for (let i = 0; i < CODE_LENGTH; i++) {
      code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    }
    const [existing] = await db.select({ id: leagues.id }).from(leagues).where(eq(leagues.inviteCode, code));
    if (!existing) return code;
  }
  throw new Error("Could not generate a unique invite code after 5 attempts — extremely unlikely, check ALPHABET/CODE_LENGTH sizing");
}

async function generateLeagueCode(sport: string, type: string): Promise<string> {
  const prefix = type === "friends" ? "FR" : sport.slice(0, 2).toUpperCase();
  const [{ value }] = await db.execute(
    sql`select count(*) + 1 as value from ${leagues} where sport = ${sport}`
  );
  return `${prefix}-${value}`;
}

// ---------------------------------------------------------------------------
// POST /api/leagues/:id/join — join a public league directly (no approval
// needed for public competitive leagues; Friends Leagues use the separate
// request-to-join flow in friendsLeagues.ts)
// ---------------------------------------------------------------------------

leaguesRouter.post("/:id/join", async (req, res) => {
  const parsed = joinLeagueSchema.safeParse({ leagueId: req.params.id });
  if (!parsed.success) return res.status(400).json({ error: "Invalid league id" });

  const userId = req.userId as string;
  const leagueId = parsed.data.leagueId;

  const [league] = await db.select().from(leagues).where(eq(leagues.id, leagueId));
  if (!league) return res.status(404).json({ error: "League not found" });

  if (league.visibility === "invite_only") {
    return res.status(403).json({
      error: "This league requires a join request. Use POST /api/friends-leagues/:id/request instead.",
    });
  }
  if (league.status !== "upcoming" && league.status !== "active") {
    return res.status(400).json({ error: "League is not open for joining" });
  }

  // null maxMembers means uncapped (always true for Friends Leagues, per
  // the 25 Jul 2026 "anyone around can join" decision) — skip the check.
  if (league.maxMembers !== null) {
    const [{ memberCount }] = await db
      .select({ memberCount: count() })
      .from(leagueMembers)
      .where(eq(leagueMembers.leagueId, leagueId));

    if (memberCount >= league.maxMembers) {
      return res.status(400).json({ error: "League is full" });
    }
  }

  const [existing] = await db
    .select()
    .from(leagueMembers)
    .where(and(eq(leagueMembers.leagueId, leagueId), eq(leagueMembers.userId, userId)));
  if (existing) return res.status(400).json({ error: "Already joined" });

  try {
    await joinLeagueInternal(leagueId, userId);
  } catch (err) {
    if (err instanceof InsufficientChipsError) {
      return res.status(400).json({ error: "Not enough chips to cover the entry fee" });
    }
    throw err;
  }

  res.status(200).json({ joined: true });
});

/**
 * Shared join logic: deducts the entry fee (if any), adds it to the vault,
 * and creates the membership row. Used by both direct public joins and
 * approved Friends League join requests.
 */
export async function joinLeagueInternal(
  leagueId: string,
  userId: string,
  opts: { isAdmin?: boolean } = {}
) {
  const [league] = await db.select().from(leagues).where(eq(leagues.id, leagueId));
  if (!league) throw new Error("League not found");

  if (league.entryFeeChips > 0) {
    await applyChipTransaction({
      userId,
      leagueId,
      type: "league_entry",
      amount: -league.entryFeeChips,
      note: `Entry fee for ${league.name}`,
    });
  }

  await db.insert(leagueMembers).values({
    leagueId,
    userId,
    status: "alive",
    isAdmin: opts.isAdmin ?? false,
  });

  // Vault grows per joiner (decided 22 Jul 2026) — fixed once the league locks.
  if (league.status === "upcoming") {
    await db
      .update(leagues)
      .set({ vaultChips: league.vaultChips + league.entryFeeChips })
      .where(eq(leagues.id, leagueId));
  }
}

// ---------------------------------------------------------------------------
// GET /api/leagues/:id — League Detail / Command Center data
// ---------------------------------------------------------------------------

leaguesRouter.get("/mine", async (req, res) => {
  const userId = req.userId as string;

  const rows = await db
    .select({
      league: leagues,
      memberStatus: leagueMembers.status,
    })
    .from(leagueMembers)
    .innerJoin(leagues, eq(leagueMembers.leagueId, leagues.id))
    .where(eq(leagueMembers.userId, userId));

  res.json(
    rows.map((r) => ({
      ...r.league,
      memberStatus: r.memberStatus, // "alive" | "knocked_out" — frontend buckets into tabs from this
    }))
  );
});

// ---------------------------------------------------------------------------

leaguesRouter.get("/:id", async (req, res) => {
  const leagueId = req.params.id;

  const [league] = await db.select().from(leagues).where(eq(leagues.id, leagueId));
  if (!league) return res.status(404).json({ error: "League not found" });

  const [{ aliveCount }] = await db
    .select({ aliveCount: count() })
    .from(leagueMembers)
    .where(and(eq(leagueMembers.leagueId, leagueId), eq(leagueMembers.status, "alive")));

  const [{ joinedCount }] = await db
    .select({ joinedCount: count() })
    .from(leagueMembers)
    .where(eq(leagueMembers.leagueId, leagueId));

  res.json({
    id: league.id,
    code: league.code,
    name: league.name,
    type: league.type,
    status: league.status,
    currentGameweek: league.currentGameweek,
    locksAt: league.locksAt,
    vaultChips: league.vaultChips,
    aliveCount,
    joinedCount,
    maxMembers: league.maxMembers,
  });
});

// ---------------------------------------------------------------------------
// GET /api/leagues/mine — powers My Leagues (Active/Friends/Knocked Out tabs)
