// artifacts/knoxit/src/lib/mockData.ts
//
// TEMPORARY placeholder data so these pages render something real while
// the backend (see the separate backend bundle) gets wired up. Once
// lib/api-client-react has generated hooks for /api/leagues, /api/picks,
// etc., replace every import from this file with the real hook calls and
// delete this file. Every place that uses this data is marked below.

export const joinLeagues = [
  { id: 1, name: "Premier League", sub: "Survivor", gw: "GW37", locks: "Locks in 02h 15m", hot: true, accent: "emerald" },
  { id: 2, name: "La Liga", sub: "Survivor", gw: "GW37", locks: "Locks in 05h 45m", accent: "violet" },
  { id: 3, name: "Bundesliga", sub: "Survivor", gw: "GW37", locks: "Locks in 07h 30m", accent: "red" },
  { id: 4, name: "UCL", sub: "Survivor", gw: "QF", locks: "Locks in 01d 10h", accent: "sky" },
];

export const friendsLeagues = [
  { id: 1, code: "WW-1", name: "Weekend Warriors", gw: "GW37", accent: "violet", alive: 4, joined: 6, pick: "Chelsea", backup: "Brighton", status: "LOCKS IN 03h 40m", statusIcon: "clock", statusColor: "violet" },
  { id: 2, code: "OR-1", name: "Office Rivals", gw: "GW37", accent: "emerald", alive: 8, joined: 11, pick: "Man City", backup: "Arsenal", status: "SURVIVED GW37", statusIcon: "check", statusColor: "emerald" },
];

export const publicFriendsLeagues = [
  {
    id: 101, name: "Gully Legends", creator: "Aarav K.", members: 8, alreadyJoined: false, inviteCode: "GULLY7",
    entryTerms: "₹500 each, winner takes the full pot. Settled directly via UPI within the group — Knoxit isn't involved in payments.",
  },
  {
    id: 102, name: "College Reunion League", creator: "Priya S.", members: 15, alreadyJoined: false, inviteCode: "REUN2K",
    entryTerms: "No money involved — just bragging rights and a WhatsApp trophy",
  },
  {
    id: 103, name: "Office Champions", creator: "Rahul M.", members: 6, alreadyJoined: true, inviteCode: "OFC99X",
    entryTerms: "₹1,000 entry, pooled prize split 70/20/10 for top 3. Handled among ourselves.",
  },
];

export const myAdminLeagueRequests = [
  { id: 1, name: "Rohit S.", forLeague: "Weekend Warriors", message: "I'm in, ready to send my share!" },
  { id: 2, name: "Meera P.", forLeague: "Weekend Warriors", message: null },
];

export const weekendWarriorsMembers = [
  { userId: "u1", username: "You", isAdmin: true, isCreator: true },
  { userId: "u2", username: "Rohit07", isAdmin: false },
  { userId: "u3", username: "Aman_11", isAdmin: true },
  { userId: "u4", username: "FootyKing", isAdmin: false },
];

export const dashboardStats = [
  { icon: "Shield", value: "3", label: "Active Leagues", sub: "You're still alive!", subColor: "text-zinc-500", accent: "emerald" },
  { icon: "Clock", value: "1", label: "Locking Soon", sub: "Next: 02h 15m", subColor: "text-amber-400", accent: "amber" },
  { icon: "Radio", value: "1", label: "Live Now", sub: "Make your picks!", subColor: "text-emerald-400", accent: "emerald" },
  { icon: "Coins", value: "6,200", label: "Total Chips", sub: "Vault Balance", subColor: "text-amber-400", accent: "amber", big: true },
];

export const activeLeagues = [
  { id: 1, code: "PL-1", name: "Premier League Survivor", gw: "GW37", accent: "emerald", alive: 7, joined: 9, pick: "Man Utd", backup: "Sunderland AFC", status: "SURVIVED GW37", statusIcon: "check", statusColor: "emerald", vault: 3500 },
  { id: 2, code: "LL-1", name: "La Liga Survivor", gw: "GW36", accent: "violet", alive: 23, joined: 34, pick: "Real Madrid", backup: "Real Sociedad", status: "LOCKS IN 02h 15m", statusIcon: "clock", statusColor: "violet", vault: 12800 },
  { id: 3, code: "BL-1", name: "Bundesliga Survivor", gw: "GW36", accent: "red", alive: 12, joined: 18, pick: "Bayern Munich", backup: "RB Leipzig", status: "LIVE NOW · Matchday 31", statusIcon: "live", statusColor: "red", vault: 7200 },
];

export const knockedOutLeagues = [
  { id: 4, code: "UCL-1", name: "UCL Survivor", gw: "Quarter Final", accent: "zinc", alive: 0, joined: 16, pick: "Arsenal", backup: "Aston Villa", status: "KNOCKED OUT · QF", statusIcon: "x", statusColor: "red", vault: 4100 },
];

export const allLeagues = [
  { id: 1, name: "Premier League Survivor", gw: "GW37", locks: "Locks in 02h 15m", hot: true, accent: "emerald", joined: 9 },
  { id: 2, name: "La Liga Survivor", gw: "GW37", locks: "Locks in 05h 45m", accent: "violet", joined: 34 },
  { id: 3, name: "Bundesliga Survivor", gw: "GW37", locks: "Locks in 07h 30m", accent: "red", joined: 18 },
  { id: 4, name: "UCL Survivor", gw: "QF", locks: "Locks in 01d 10h", accent: "sky", joined: 16 },
  { id: 5, name: "Serie A Survivor", gw: "GW36", locks: "Locks in 09h 20m", accent: "amber", joined: 27 },
  { id: 6, name: "Ligue 1 Survivor", gw: "GW35", locks: "Locks in 12h 05m", accent: "rose", joined: 14 },
  { id: 7, name: "MLS Survivor", gw: "GW22", locks: "Locks in 1d 04h", accent: "cyan", joined: 8 },
];

export const leagueDetailData = {
  name: "Premier League Survivor #1", code: "PL-1", gw: 37, locksIn: "02h 14m 33s",
  vault: 3500, aliveCount: 4, joinedCount: 20,
  yourPick: { team: "Man Utd", backup: "Sunderland AFC", live: true, minute: "67'", home: "Man Utd", away: "Brentford", homeScore: 2, awayScore: 1 },
  survivors: [
    { id: 1, name: "You", isYou: true },
    { id: 2, name: "Rohit07" },
    { id: 3, name: "Aman_11" },
    { id: 4, name: "FootyKing" },
  ],
  extraSurvivors: 0,
  knockedOut: [
    { id: 1, name: "Chirag_10" },
    { id: 2, name: "FantasyGoat" },
  ],
  history: [
    { gw: "GW34", result: "Survived", alive: 10 },
    { gw: "GW35", result: "Survived", alive: 7 },
    { gw: "GW36", result: "Survived", alive: 5 },
    { gw: "GW37", result: "Live", alive: 4 },
  ],
  chat: [
    { user: "Rohit07", tag: "MOD", text: "Big game! Good luck everyone", time: "10:30 AM" },
    { user: "Aman_11", text: "Let's go! Man Utd better deliver", time: "10:32 AM" },
  ],
};

export const opponentProfileData = {
  name: "Rohit07", status: "STILL ALIVE", streak: "Survived 6 straight GWs",
  currentPick: { team: "Arsenal", backup: "Chelsea", locked: true },
  timeline: [
    { gw: "GW31", team: "Liverpool", done: true },
    { gw: "GW32", team: "Man City", done: true },
    { gw: "GW33", team: "Tottenham", done: true },
    { gw: "GW34", team: "Aston Villa", done: true },
    { gw: "GW35", team: "Newcastle", done: true },
    { gw: "GW36", team: "West Ham", done: true },
    { gw: "GW37", team: "Arsenal", done: false },
  ],
  stats: [
    { label: "Longest Streak", value: "6" },
    { label: "Survival Rate", value: "81%" },
    { label: "Risk Picks Used", value: "4" },
    { label: "Total GWs", value: "12" },
  ],
};

export const accentMap: Record<string, { border: string; text: string; btn: string }> = {
  emerald: { border: "border-emerald-500/40", text: "text-emerald-400", btn: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  violet: { border: "border-violet-500/40", text: "text-violet-400", btn: "bg-violet-500/20 text-violet-300 border-violet-500/30" },
  red: { border: "border-red-500/40", text: "text-red-400", btn: "bg-red-500/15 text-red-400 border-red-500/30" },
  sky: { border: "border-sky-500/40", text: "text-sky-400", btn: "bg-sky-500/15 text-sky-400 border-sky-500/30" },
  amber: { border: "border-amber-500/40", text: "text-amber-400", btn: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  rose: { border: "border-rose-500/40", text: "text-rose-400", btn: "bg-rose-500/15 text-rose-400 border-rose-500/30" },
  cyan: { border: "border-cyan-500/40", text: "text-cyan-400", btn: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30" },
};

export const accentBorder: Record<string, string> = {
  emerald: "border-l-emerald-500",
  violet: "border-l-violet-500",
  red: "border-l-red-500",
  zinc: "border-l-red-500/60",
};

export function initialsFor(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

export const lockingSoonPicks = [
  { leagueId: 1, leagueName: "Premier League Survivor", code: "PL-1", gw: "GW38", locksIn: "18m", accent: "emerald" },
  { leagueId: 2, leagueName: "La Liga Survivor", code: "LL-1", gw: "GW38", locksIn: "1h 42m", accent: "violet" },
];

export const submittedPicks = [
  { leagueId: 3, leagueName: "Bundesliga Survivor", code: "BL-1", gw: "GW37", primary: "Bayern Munich", backup: "RB Leipzig" },
  { leagueId: 5, leagueName: "Serie A Survivor", code: "SA-1", gw: "GW30", primary: "Inter Milan", backup: "Bologna" },
];

export const liveNowPicks = [
  { leagueId: 3, leagueName: "Bundesliga Survivor", opponent: "Dortmund", team: "Bayern Munich", homeScore: 2, awayScore: 1, minute: "63'", winning: true },
];

export const awaitingResultsPicks = [
  { leagueId: 5, leagueName: "Serie A Survivor", opponent: "vs Bologna", team: "Inter Milan", kickoff: "Tomorrow 8:30 PM" },
];

// Available team pool for a given league, used by the Pick Submission
// screen — mirrors TEAM_POOLS in the real picks.ts route (kept in sync
// manually here for the demo; real version fetches from GET
// /api/leagues/available-teams/:leagueId).
export const teamPool = [
  "Arsenal", "Aston Villa", "Bournemouth", "Brentford", "Brighton", "Chelsea",
  "Crystal Palace", "Everton", "Fulham", "Ipswich Town", "Leicester City",
  "Liverpool", "Man City", "Man Utd", "Newcastle", "Nottingham Forest",
  "Southampton", "Tottenham", "West Ham", "Wolves",
];
export const usedTeamsThisCycle = ["Man Utd", "Arsenal", "Liverpool"]; // already picked this cycle, greyed out

export const fixturesLeagues = [
  { key: "epl", label: "EPL" },
  { key: "la_liga", label: "La Liga" },
  { key: "bundesliga", label: "Bundesliga" },
  { key: "serie_a", label: "Serie A" },
  { key: "ucl", label: "UCL" },
];

export const currentGameweek = 38;

// Keyed by gameweek number. "upcoming" gameweeks show kickoff time + venue.
// "completed" gameweeks show the final score plus each team's last-5 form
// (25 Jul 2026 decision: replaces the old Today/Tomorrow/Upcoming sections
// entirely — left/right arrows navigate between gameweeks instead).
export const gameweekFixtures: Record<number, Array<{
  id: number; home: string; away: string; status: "upcoming" | "completed";
  time?: string; venue?: string; homeScore?: number; awayScore?: number;
  homeForm: string[]; awayForm: string[];
}>> = {
  38: [
    { id: 1, home: "Liverpool", away: "Arsenal", status: "upcoming", time: "8:30 PM", venue: "Anfield", homeForm: ["W", "W", "D", "W", "W"], awayForm: ["L", "W", "W", "D", "W"] },
    { id: 2, home: "Newcastle", away: "Chelsea", status: "upcoming", time: "11:00 PM", venue: "St. James' Park", homeForm: ["W", "W", "W", "D", "W"], awayForm: ["W", "D", "L", "W", "W"] },
    { id: 3, home: "Man City", away: "Tottenham", status: "upcoming", time: "6:30 PM", venue: "Etihad Stadium", homeForm: ["W", "W", "W", "W", "D"], awayForm: ["W", "D", "L", "W", "W"] },
  ],
  37: [
    { id: 4, home: "Man Utd", away: "West Ham", status: "completed", homeScore: 2, awayScore: 1, homeForm: ["L", "W", "W", "D", "L"], awayForm: ["D", "L", "W", "L", "D"] },
    { id: 5, home: "Aston Villa", away: "Brighton", status: "completed", homeScore: 1, awayScore: 1, homeForm: ["W", "L", "W", "W", "D"], awayForm: ["D", "W", "D", "L", "W"] },
  ],
  36: [
    { id: 6, home: "Bournemouth", away: "Everton", status: "completed", homeScore: 0, awayScore: 2, homeForm: ["L", "D", "L", "W", "L"], awayForm: ["W", "W", "D", "W", "L"] },
  ],
};

export const formGuide = [
  { rank: 1, team: "Man City", form: ["W", "W", "W", "W", "D"], points: 85 },
  { rank: 2, team: "Arsenal", form: ["W", "W", "D", "W", "W"], points: 83 },
  { rank: 3, team: "Liverpool", form: ["W", "W", "D", "W", "W"], points: 81 },
  { rank: 4, team: "Aston Villa", form: ["W", "L", "W", "W", "D"], points: 68 },
  { rank: 5, team: "Tottenham", form: ["W", "D", "L", "W", "W"], points: 63 },
];

export const chipBalance = 2850;

export const dailyReward = { amount: 25, claimedToday: true };

// Ads-required scales with chip cost (~1 ad per 200 chips, rounded up) —
// validated against the person's own example: Draw Shield (1000 chips) → 5 ads.
export function adsRequiredFor(cost: number): number {
  return Math.ceil(cost / 200);
}

// Note: the "Featured" tab was renamed to "Merch" (25 Jul 2026) since that's
// what it actually shows — Jerseys, Footballs, etc. If a genuine "featured/
// highlighted item" concept is wanted later, it deserves its own treatment
// rather than reusing this array.

export const boosterItems = [
  { id: "draw_shield", name: "Draw Shield", description: "If your pick draws, you survive instead of being eliminated. Use before lock.", cost: 1000, icon: "Equal" },
  { id: "team_recall", name: "Team Recall", description: "Pick a team you've already used again. Once per league, ever.", cost: 1800, icon: "RotateCcw" },
  { id: "league_pulse", name: "League Pulse", description: "See what % of your league picked each team this gameweek, before lock.", cost: 700, icon: "BarChart3" },
  { id: "opponent_reveal", name: "Opponent Reveal", description: "See one opponent's pick before lock.", cost: 750, icon: "Eye" },
  { id: "lock_extension", name: "Lock Extension", description: "Extend lock time by 15 minutes.", cost: 600, icon: "Clock" },
];

// Real-money chip packs — NOT purchasable yet, no payment gateway wired up.
// Tapping these shows a clear "coming soon" state rather than faking a
// working purchase (25 Jul 2026 decision — see shop.ts backend notes).
export const chipPacks = [
  { id: "pack_1000", chips: 1000, priceINR: 49 },
  { id: "pack_2500", chips: 2500, priceINR: 99 },
  { id: "pack_6000", chips: 6000, priceINR: 199, bestValue: true },
  { id: "pack_15000", chips: 15000, priceINR: 399 },
];

// Merch — coming soon, not purchasable. Faded/locked teaser only, styled
// with a diagonal "COMING SOON" ribbon per the reference design (25 Jul 2026).
export const merchTeasers = [
  { id: "jerseys", name: "Jerseys", subtitle: "Football kits & strips", accent: "blue", featured: true },
  { id: "footballs", name: "Footballs", subtitle: "Match & training balls", accent: "sky" },
  { id: "boots", name: "Boots & Gear", subtitle: "Footwear & accessories", accent: "orange" },
  { id: "fan_merch", name: "Fan Merch", subtitle: "Scarves, caps, flags", accent: "red" },
  { id: "badges", name: "Badges", subtitle: "Profile & league badges", accent: "amber" },
  { id: "cosmetics", name: "Cosmetics", subtitle: "Avatars & profile skins", accent: "violet" },
  { id: "vault_skins", name: "Vault Skins", subtitle: "Custom vault themes", accent: "amber" },
  { id: "special_rewards", name: "Special Rewards", subtitle: "Rare limited drops", accent: "emerald" },
  { id: "coupon_rewards", name: "Coupon Rewards", subtitle: "Discount codes & offers", accent: "emerald" },
];
