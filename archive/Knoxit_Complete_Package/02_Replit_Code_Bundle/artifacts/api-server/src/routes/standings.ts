// artifacts/api-server/src/routes/standings.ts
//
// Powers the Fixtures tab's "Form Guide" table (points + last-5 results
// per team). This is genuinely separate from your existing fixtures sync
// — football-data.org exposes standings via a different endpoint
// (/v4/competitions/{code}/standings), not derivable from the fixtures
// table alone. Uses the same server-side-only API key pattern as your
// existing footballData.ts helper — adjust the import to match its real
// exported function name/signature, since I don't have visibility into
// that file's exact contents from here.

import { Router } from "express";
// import { fetchFromFootballData } from "../lib/footballData"; // adjust to match your existing helper's actual export

export const standingsRouter = Router();

const COMPETITION_CODES: Record<string, string> = {
  epl: "PL",
  la_liga: "PD",
  bundesliga: "BL1",
  serie_a: "SA",
  ucl: "CL",
};

// ---------------------------------------------------------------------------
// GET /api/standings/:league — table with points + last-5 form per team
// ---------------------------------------------------------------------------

standingsRouter.get("/:league", async (req, res) => {
  const leagueKey = req.params.league;
  const competitionCode = COMPETITION_CODES[leagueKey];
  if (!competitionCode) {
    return res.status(400).json({ error: `Unknown league key: ${leagueKey}` });
  }

  // TODO: replace this stub with a real call through your existing
  // footballData.ts helper, e.g.:
  //   const data = await fetchFromFootballData(`/v4/competitions/${competitionCode}/standings`);
  // football-data.org's standings response includes a `form` string per
  // team (e.g. "W,W,D,W,W") — split on comma for the badge row, and
  // `points` directly off each standing entry. Consider caching this
  // (e.g. 15-60 min TTL) since standings don't change mid-match and this
  // avoids hammering football-data.org's rate limits every time someone
  // opens the Fixtures tab.
  res.status(501).json({
    error: "Not implemented — wire this to football-data.org's standings endpoint via your existing footballData.ts helper.",
    competitionCode,
  });
});
