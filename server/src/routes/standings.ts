import { Router } from "express";
import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "@db/index";
import { footballCompetitions, footballFixtures, footballStandings } from "@db/schema";
import { isFootballCompetitionKey } from "../lib/footballCompetitions";

export const standingsRouter = Router();

standingsRouter.get("/:league", async (req, res) => {
  const leagueKey = req.params.league;
  if (!isFootballCompetitionKey(leagueKey)) {
    return res.status(400).json({ error: `Unknown league key: ${leagueKey}` });
  }

  const [competition] = await db
    .select()
    .from(footballCompetitions)
    .where(eq(footballCompetitions.key, leagueKey));
  if (!competition || competition.seasonStartYear === null) {
    return res.status(404).json({ error: "Competition has not been synced yet" });
  }

  const rows = await db
    .select()
    .from(footballStandings)
    .where(
      and(
        eq(footballStandings.competitionKey, leagueKey),
        eq(footballStandings.seasonStartYear, competition.seasonStartYear),
        eq(footballStandings.type, "TOTAL")
      )
    )
    .orderBy(asc(footballStandings.group), asc(footballStandings.position));

  const finishedFixtures = await db
    .select()
    .from(footballFixtures)
    .where(and(eq(footballFixtures.competitionKey, leagueKey), eq(footballFixtures.status, "FINISHED")))
    .orderBy(desc(footballFixtures.utcDate));

  function calculatedForm(teamId: number) {
    return finishedFixtures
      .filter((fixture) => fixture.homeTeamId === teamId || fixture.awayTeamId === teamId)
      .slice(0, 5)
      .map((fixture) => {
        if (fixture.winner === "DRAW") return "D";
        const won = (fixture.homeTeamId === teamId && fixture.winner === "HOME_TEAM")
          || (fixture.awayTeamId === teamId && fixture.winner === "AWAY_TEAM");
        return won ? "W" : "L";
      })
      .reverse();
  }

  res.json({
    competition,
    standings: rows.map((row) => ({
      ...row,
      form: row.form?.split(",").filter(Boolean).slice(-5) ?? calculatedForm(row.teamId),
    })),
  });
});
