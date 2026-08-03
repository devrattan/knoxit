// artifacts/api-server/src/routes/picks.ts
//
// Handles pick submission, including:
//   1. "Can't pick the same team twice" within a cycle
//   2. Pool-exhaustion reset — once a player has used every team in the
//      sport's pool, the pool resets and they can pick any team again
//      (per your 25 Jul 2026 discussion: leagues can run longer than the
//      team pool, so it must cycle rather than lock players out).
//
// NOTE: fixture lock-time enforcement (you can't submit after kickoff) is
// a separate concern that needs your fixtures table wired in — there's a
// TODO marker below for where that check belongs once fixtures data is
// available via GET /api/fixtures.

import { Router } from "express";
import { eq, and, asc } from "drizzle-orm";
import { db } from "../../../../lib/db";
import { picks, leagues, leagueMembers, activeBoosters } from "../../../../lib/db/schema";
import { submitPickSchema } from "../../../../lib/api-zod/src/knoxit-schemas";

export const picksRouter = Router();

// ---------------------------------------------------------------------------
// Team pools per sport. Fill these in with the real team lists (e.g. from
// football-data.org's competition standings) — these are placeholders
// showing the expected shape.
// ---------------------------------------------------------------------------

const TEAM_POOLS: Record<string, string[]> = {
  premier_league: [
    "Arsenal", "Aston Villa", "Bournemouth", "Brentford", "Brighton", "Chelsea",
    "Crystal Palace", "Everton", "Fulham", "Ipswich Town", "Leicester City",
    "Liverpool", "Man City", "Man Utd", "Newcastle", "Nottingham Forest",
    "Southampton", "Tottenham", "West Ham", "Wolves",
  ],
  // la_liga, bundesliga, etc. follow the same shape
};

/**
 * Walks a user's pick history for a league in submission order and figures
 * out which teams are "used" in the *current* cycle. Whenever the used-set
 * reaches the full pool size, the cycle resets and a fresh empty set starts
 * for picks after that point.
 */
async function getUsedTeamsThisCycle(userId: string, leagueId: string, poolSize: number): Promise<Set<string>> {
  const history = await db
    .select({ primaryTeam: picks.primaryTeam })
    .from(picks)
    .where(and(eq(picks.leagueId, leagueId), eq(picks.userId, userId)))
    .orderBy(asc(picks.submittedAt));

  let used = new Set<string>();
  for (const row of history) {
    used.add(row.primaryTeam);
    if (used.size >= poolSize) {
      used = new Set<string>(); // pool exhausted — reset for next pick
    }
  }
  return used;
}

// ---------------------------------------------------------------------------
// GET /api/leagues/:id/available-teams — powers the Pick Submission screen,
// showing which teams are still pickable vs. used this cycle
// ---------------------------------------------------------------------------

picksRouter.get("/available-teams/:leagueId", async (req, res) => {
  const userId = req.userId as string;
  const leagueId = req.params.leagueId;

  const [league] = await db.select().from(leagues).where(eq(leagues.id, leagueId));
  if (!league) return res.status(404).json({ error: "League not found" });

  const pool = TEAM_POOLS[league.sport] ?? [];
  const usedThisCycle = pool.length ? await getUsedTeamsThisCycle(userId, leagueId, pool.length) : new Set<string>();

  res.json({
    pool,
    used: Array.from(usedThisCycle),
  });
});

/**
 * Checks whether the user has an unconsumed Team Recall active for this
 * exact league + gameweek + team. Doesn't check the once-per-league cap
 * here — that's enforced at purchase time in shop.ts; this just checks
 * whether a previously-activated one applies to the pick being submitted.
 */
async function getActiveTeamRecall(userId: string, leagueId: string, gameweek: number, team: string) {
  const [recall] = await db
    .select()
    .from(activeBoosters)
    .where(
      and(
        eq(activeBoosters.userId, userId),
        eq(activeBoosters.leagueId, leagueId),
        eq(activeBoosters.gameweek, gameweek),
        eq(activeBoosters.boosterType, "team_recall"),
        eq(activeBoosters.team, team)
      )
    );
  return recall ?? null;
}

// ---------------------------------------------------------------------------
// POST /api/picks — submit primary + optional backup pick for a gameweek
// ---------------------------------------------------------------------------

picksRouter.post("/", async (req, res) => {
  const parsed = submitPickSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
  }
  const input = parsed.data;
  const userId = req.userId as string;

  const [league] = await db.select().from(leagues).where(eq(leagues.id, input.leagueId));
  if (!league) return res.status(404).json({ error: "League not found" });

  const [membership] = await db
    .select()
    .from(leagueMembers)
    .where(and(eq(leagueMembers.leagueId, input.leagueId), eq(leagueMembers.userId, userId)));
  if (!membership) return res.status(403).json({ error: "Not a member of this league" });
  if (membership.status === "knocked_out") {
    return res.status(400).json({ error: "You've been knocked out of this league" });
  }

  const [alreadySubmitted] = await db
    .select()
    .from(picks)
    .where(
      and(
        eq(picks.leagueId, input.leagueId),
        eq(picks.userId, userId),
        eq(picks.gameweek, input.gameweek)
      )
    );
  if (alreadySubmitted) {
    return res.status(400).json({ error: "Pick already submitted for this gameweek" });
  }

  // TODO: check the relevant fixture's kickoff time (via fixtures table)
  // and reject if it's already locked/started. Wire this in once fixtures
  // data includes a per-gameweek lock timestamp accessible here.

  const pool = TEAM_POOLS[league.sport];
  if (pool) {
    const usedThisCycle = await getUsedTeamsThisCycle(userId, input.leagueId, pool.length);

    if (usedThisCycle.has(input.primaryTeam)) {
      const recall = await getActiveTeamRecall(userId, input.leagueId, input.gameweek, input.primaryTeam);
      if (!recall) {
        return res.status(400).json({
          error: `You've already used ${input.primaryTeam} this cycle. It'll be available again once you've used every team in the pool, or use Team Recall (once per league) to pick it again now.`,
        });
      }
      // Team Recall covers this exact team+gameweek — mark it consumed so
      // it can't be silently reused, even though the once-per-league cap
      // in shop.ts already prevents buying a second one.
      await db.update(activeBoosters).set({ consumedAt: new Date() }).where(eq(activeBoosters.id, recall.id));
    }

    if (input.backupTeam && usedThisCycle.has(input.backupTeam)) {
      return res.status(400).json({ error: `You've already used ${input.backupTeam} this cycle.` });
    }
    if (!pool.includes(input.primaryTeam)) {
      return res.status(400).json({ error: `${input.primaryTeam} is not in this sport's team pool` });
    }
  }

  const [pick] = await db
    .insert(picks)
    .values({
      leagueId: input.leagueId,
      userId,
      gameweek: input.gameweek,
      primaryTeam: input.primaryTeam,
      backupTeam: input.backupTeam ?? null,
      result: "pending",
    })
    .returning();

  res.status(201).json(pick);
});

// ---------------------------------------------------------------------------
// GET /api/picks/me?leagueId=... — powers the Picks tab (global or per-league)
// ---------------------------------------------------------------------------

picksRouter.get("/me", async (req, res) => {
  const userId = req.userId as string;
  const leagueId = req.query.leagueId as string | undefined;

  const rows = await db
    .select()
    .from(picks)
    .where(leagueId ? and(eq(picks.userId, userId), eq(picks.leagueId, leagueId)) : eq(picks.userId, userId))
    .orderBy(asc(picks.gameweek));

  res.json(rows);
});

// ---------------------------------------------------------------------------
// Elimination resolution — call this from your results engine/cron once
// match results are in. Not exposed as a public route; this is the shared
// logic your fixture-results job should invoke per pick.
// ---------------------------------------------------------------------------

/**
 * @param outcome "win" | "draw" | "loss" | "no_result" — the actual outcome
 *   for the team the user picked.
 *
 * IMPORTANT CORRECTION (25 Jul 2026): backup picks do NOT trigger on a loss
 * or an un-shielded draw. A previous version of this function got that
 * wrong — it fell through to checking the backup pick whenever the primary
 * didn't win, which is not the intended rule and would have let people
 * effectively get two live attempts every gameweek.
 *
 * The actual rule: backup exists ONLY to protect against the primary
 * team's match not being played at all — postponed, abandoned, whatever
 * reason. If the match was played and your team drew or lost, you're
 * eliminated (or saved by Draw Shield on a draw) — full stop, backup is
 * never consulted. Backup only comes into play when there's no real
 * result to judge the primary pick on.
 *
 * "no_result" is what your results engine should pass when a fixture is
 * postponed/abandoned/not played by the time results are processed.
 */
export async function resolvePick(pickId: string, outcome: "win" | "draw" | "loss" | "no_result") {
  const [pick] = await db.select().from(picks).where(eq(picks.id, pickId));
  if (!pick) throw new Error("Pick not found");

  if (outcome === "win") {
    await db.update(picks).set({ result: "survived" }).where(eq(picks.id, pickId));
    return;
  }

  if (outcome === "draw") {
    const [shield] = await db
      .select()
      .from(activeBoosters)
      .where(
        and(
          eq(activeBoosters.userId, pick.userId),
          eq(activeBoosters.leagueId, pick.leagueId),
          eq(activeBoosters.gameweek, pick.gameweek),
          eq(activeBoosters.boosterType, "draw_shield")
        )
      );

    if (shield) {
      await db.update(picks).set({ result: "survived" }).where(eq(picks.id, pickId));
      await db
        .update(activeBoosters)
        .set({ consumedAt: new Date() })
        .where(eq(activeBoosters.id, shield.id));
      return;
    }

    // No Draw Shield active — eliminated. Backup is NOT checked; the
    // match was played and produced a real (non-winning) result.
    await db.update(picks).set({ result: "eliminated" }).where(eq(picks.id, pickId));
    await db
      .update(leagueMembers)
      .set({ status: "knocked_out", knockedOutAtGameweek: pick.gameweek })
      .where(and(eq(leagueMembers.leagueId, pick.leagueId), eq(leagueMembers.userId, pick.userId)));
    return;
  }

  if (outcome === "loss") {
    // Match was played, team lost. Eliminated — backup is NOT checked.
    await db.update(picks).set({ result: "eliminated" }).where(eq(picks.id, pickId));
    await db
      .update(leagueMembers)
      .set({ status: "knocked_out", knockedOutAtGameweek: pick.gameweek })
      .where(and(eq(leagueMembers.leagueId, pick.leagueId), eq(leagueMembers.userId, pick.userId)));
    return;
  }

  // outcome === "no_result" — the ONLY case where backup is relevant.
  if (pick.backupTeam && !pick.usedBackup) {
    await db.update(picks).set({ usedBackup: true }).where(eq(picks.id, pickId));
    // NOTE: your results engine should now resolve THIS pick again once the
    // backup team's own match has a result, calling resolvePick with that
    // match's outcome ("win"/"draw"/"loss"/"no_result" again if even the
    // backup's match doesn't happen). This function only marks that backup
    // is now in play; the actual survived/eliminated call for the backup's
    // match belongs in the results engine, which has the fixture data this
    // module doesn't.
    return;
  }

  // No backup set (or backup already used) and the primary match still
  // didn't happen — this is a genuine edge case worth a real product
  // decision, not a default I should silently invent. Leaving the pick as
  // "pending" rather than guessing eliminated/survived; your results
  // engine should hold this gameweek open for the player until the
  // fixture is rescheduled and actually played.
}
