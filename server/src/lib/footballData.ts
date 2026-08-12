const BASE_URL = "https://api.football-data.org/v4";

export class FootballDataError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly retryAfterSeconds?: number
  ) {
    super(message);
    this.name = "FootballDataError";
  }
}

export async function fetchFootballData<T>(path: string): Promise<T> {
  const token = process.env.FOOTBALL_DATA_API_KEY;
  if (!token) throw new Error("FOOTBALL_DATA_API_KEY is required to sync football data");

  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "X-Auth-Token": token,
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(20_000),
  });

  if (!response.ok) {
    const body = await response.text();
    const reset = Number(response.headers.get("x-requestcounter-reset") ?? response.headers.get("retry-after"));
    throw new FootballDataError(
      `football-data.org returned ${response.status}: ${body.slice(0, 300)}`,
      response.status,
      Number.isFinite(reset) ? reset : undefined
    );
  }

  return response.json() as Promise<T>;
}

export type ProviderTeam = {
  id: number | null;
  name: string;
  shortName?: string | null;
  crest?: string | null;
};

export type ProviderMatch = {
  id: number;
  utcDate: string;
  status: string;
  venue?: string | null;
  matchday?: number | null;
  stage?: string | null;
  group?: string | null;
  lastUpdated?: string | null;
  season?: {
    startDate?: string;
    currentMatchday?: number | null;
  };
  homeTeam: ProviderTeam;
  awayTeam: ProviderTeam;
  score: {
    winner?: string | null;
    fullTime?: { home?: number | null; away?: number | null };
  };
};

export type ProviderMatchesResponse = {
  competition: { name: string; code: string; emblem?: string | null };
  matches: ProviderMatch[];
};

export type ProviderStandingRow = {
  position: number;
  team: ProviderTeam;
  playedGames: number;
  form?: string | null;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
};

export type ProviderStandingsResponse = {
  competition: { name: string; code: string; emblem?: string | null };
  season: { startDate: string; currentMatchday?: number | null };
  standings: Array<{
    stage: string;
    type: string;
    group?: string | null;
    table: ProviderStandingRow[];
  }>;
};
