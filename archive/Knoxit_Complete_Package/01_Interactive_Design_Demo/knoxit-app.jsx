import React, { useState } from "react";
import {
  Menu, Bell, Shield, Clock, Radio, Coins, ChevronRight, ChevronRightCircle,
  Home as HomeIcon, Trophy, Target, Calendar, ShoppingBag, Plus,
  CheckCircle2, XCircle, Settings, MessageCircle, Lock, Handshake, KeyRound,
  MessageSquareText, Globe, AlertTriangle, Check, Search, Filter,
  ChevronLeft, Gift, Zap, Eye, Equal, RotateCcw, PlayCircle, BarChart3, Users,
} from "lucide-react";

const merchAccent = {
  blue: { from: "from-blue-900/60", via: "via-blue-950/40" },
  sky: { from: "from-sky-900/50", via: "via-sky-950/30" },
  orange: { from: "from-orange-900/50", via: "via-orange-950/30" },
  red: { from: "from-red-900/50", via: "via-red-950/30" },
  amber: { from: "from-amber-900/50", via: "via-amber-950/30" },
  violet: { from: "from-violet-900/50", via: "via-violet-950/30" },
  emerald: { from: "from-emerald-900/50", via: "via-emerald-950/30" },
};

/* ---------- shared data ---------- */

const joinLeagues = [
  { id: 1, name: "Premier League", sub: "Survivor", gw: "GW37", locks: "Locks in 02h 15m", hot: true, accent: "emerald" },
  { id: 2, name: "La Liga", sub: "Survivor", gw: "GW37", locks: "Locks in 05h 45m", accent: "violet" },
  { id: 3, name: "Bundesliga", sub: "Survivor", gw: "GW37", locks: "Locks in 07h 30m", accent: "red" },
  { id: 4, name: "UCL", sub: "Survivor", gw: "QF", locks: "Locks in 01d 10h", accent: "sky" },
];

const friendsLeagues = [
  { id: 1, code: "WW-1", name: "Weekend Warriors", gw: "GW37", accent: "violet", alive: 4, joined: 6, pick: "Chelsea", backup: "Brighton", status: "LOCKS IN 03h 40m", statusIcon: "clock", statusColor: "violet" },
  { id: 2, code: "OR-1", name: "Office Rivals", gw: "GW37", accent: "emerald", alive: 8, joined: 11, pick: "Man City", backup: "Arsenal", status: "SURVIVED GW37", statusIcon: "check", statusColor: "emerald" },
];

const publicFriendsLeagues = [
  {
    id: 101, name: "Gully Legends", creator: "Aarav K.", members: 8, alreadyJoined: false,
    entryTerms: "₹500 each, winner takes the full pot. Settled directly via UPI within the group — Knoxit isn't involved in payments.",
  },
  {
    id: 102, name: "College Reunion League", creator: "Priya S.", members: 15, alreadyJoined: false,
    entryTerms: "No money involved — just bragging rights and a WhatsApp trophy 🏆",
  },
  {
    id: 103, name: "Office Champions", creator: "Rahul M.", members: 6, alreadyJoined: true,
    entryTerms: "₹1,000 entry, pooled prize split 70/20/10 for top 3. Handled among ourselves.",
  },
];

const myAdminLeagueRequests = [
  { id: 1, name: "Rohit S.", forLeague: "Weekend Warriors", message: "I'm in, ready to send my share!" },
  { id: 2, name: "Meera P.", forLeague: "Weekend Warriors", message: null },
];

const lockingSoonPicks = [
  { leagueId: 1, leagueName: "Premier League Survivor", code: "PL-1", gw: "GW38", locksIn: "18m", accent: "emerald" },
  { leagueId: 2, leagueName: "La Liga Survivor", code: "LL-1", gw: "GW38", locksIn: "1h 42m", accent: "violet" },
];

const submittedPicks = [
  { leagueId: 3, leagueName: "Bundesliga Survivor", code: "BL-1", gw: "GW37", primary: "Bayern Munich", backup: "RB Leipzig" },
  { leagueId: 5, leagueName: "Serie A Survivor", code: "SA-1", gw: "GW30", primary: "Inter Milan", backup: "Bologna" },
];

const liveNowPicks = [
  { leagueId: 3, leagueName: "Bundesliga Survivor", opponent: "Dortmund", team: "Bayern Munich", homeScore: 2, awayScore: 1, minute: "63'", winning: true },
];

const awaitingResultsPicks = [
  { leagueId: 5, leagueName: "Serie A Survivor", opponent: "vs Bologna", team: "Inter Milan", kickoff: "Tomorrow 8:30 PM" },
];

const teamPool = [
  "Arsenal", "Aston Villa", "Bournemouth", "Brentford", "Brighton", "Chelsea",
  "Crystal Palace", "Everton", "Fulham", "Ipswich Town", "Leicester City",
  "Liverpool", "Man City", "Man Utd", "Newcastle", "Nottingham Forest",
  "Southampton", "Tottenham", "West Ham", "Wolves",
];
const usedTeamsThisCycle = ["Man Utd", "Arsenal", "Liverpool"];

const fixturesLeagues = [
  { key: "epl", label: "EPL" },
  { key: "la_liga", label: "La Liga" },
  { key: "bundesliga", label: "Bundesliga" },
  { key: "serie_a", label: "Serie A" },
  { key: "ucl", label: "UCL" },
];
const currentGameweek = 38;
const gameweekFixtures = {
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
const formGuide = [
  { rank: 1, team: "Man City", form: ["W", "W", "W", "W", "D"], points: 85 },
  { rank: 2, team: "Arsenal", form: ["W", "W", "D", "W", "W"], points: 83 },
  { rank: 3, team: "Liverpool", form: ["W", "W", "D", "W", "W"], points: 81 },
  { rank: 4, team: "Aston Villa", form: ["W", "L", "W", "W", "D"], points: 68 },
  { rank: 5, team: "Tottenham", form: ["W", "D", "L", "W", "W"], points: 63 },
];

const chipBalance = 2850;
const dailyReward = { amount: 25, claimedToday: true };
function adsRequiredFor(cost) {
  return Math.ceil(cost / 200);
}

const boosterItems = [
  { id: "draw_shield", name: "Draw Shield", description: "If your pick draws, you survive instead of being eliminated. Use before lock.", cost: 1000, icon: "Equal" },
  { id: "team_recall", name: "Team Recall", description: "Pick a team you've already used again. Once per league, ever.", cost: 1800, icon: "RotateCcw" },
  { id: "league_pulse", name: "League Pulse", description: "See what % of your league picked each team this gameweek, before lock.", cost: 700, icon: "BarChart3" },
  { id: "opponent_reveal", name: "Opponent Reveal", description: "See one opponent's pick before lock.", cost: 750, icon: "Eye" },
  { id: "lock_extension", name: "Lock Extension", description: "Extend lock time by 15 minutes.", cost: 600, icon: "Clock" },
];
const chipPacks = [
  { id: "pack_1000", chips: 1000, priceINR: 49 },
  { id: "pack_2500", chips: 2500, priceINR: 99 },
  { id: "pack_6000", chips: 6000, priceINR: 199, bestValue: true },
  { id: "pack_15000", chips: 15000, priceINR: 399 },
];
const merchTeasers = [
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

const leagueDetailData = {
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
    { id: 1, name: "Chirag_10", score: "LIV 0 - 1 FUL", pick: "Liverpool", gw: "GW37" },
    { id: 2, name: "FantasyGoat", score: "NEW 1 - 2 BHA", pick: "Newcastle", gw: "GW37" },
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

const opponentProfileData = {
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

const dashboardStats = [
  { icon: Shield, value: "3", label: "Active Leagues", sub: "You're still alive!", subColor: "text-zinc-500", accent: "emerald" },
  { icon: Clock, value: "1", label: "Locking Soon", sub: "Next: 02h 15m", subColor: "text-amber-400", accent: "amber" },
  { icon: Radio, value: "1", label: "Live Now", sub: "Make your picks!", subColor: "text-emerald-400", accent: "emerald" },
  { icon: Coins, value: "6,200", label: "Total Chips", sub: "Vault Balance", subColor: "text-amber-400", accent: "amber", big: true },
];

const activeLeagues = [
  { id: 1, code: "PL-1", name: "Premier League Survivor", gw: "GW37", accent: "emerald", alive: 7, joined: 9, pick: "Man Utd", backup: "Sunderland AFC", status: "SURVIVED GW37", statusIcon: "check", statusColor: "emerald", vault: 3500 },
  { id: 2, code: "LL-1", name: "La Liga Survivor", gw: "GW36", accent: "violet", alive: 23, joined: 34, pick: "Real Madrid", backup: "Real Sociedad", status: "LOCKS IN 02h 15m", statusIcon: "clock", statusColor: "violet", vault: 12800 },
  { id: 3, code: "BL-1", name: "Bundesliga Survivor", gw: "GW36", accent: "red", alive: 12, joined: 18, pick: "Bayern Munich", backup: "RB Leipzig", status: "LIVE NOW · Matchday 31", statusIcon: "live", statusColor: "red", vault: 7200 },
];

const knockedOutLeagues = [
  { id: 4, code: "UCL-1", name: "UCL Survivor", gw: "Quarter Final", accent: "zinc", alive: 0, joined: 16, pick: "Arsenal", backup: "Aston Villa", status: "KNOCKED OUT · QF", statusIcon: "x", statusColor: "red" },
];

const allLeagues = [
  { id: 1, name: "Premier League Survivor", gw: "GW37", locks: "Locks in 02h 15m", hot: true, accent: "emerald", joined: 9 },
  { id: 2, name: "La Liga Survivor", gw: "GW37", locks: "Locks in 05h 45m", accent: "violet", joined: 34 },
  { id: 3, name: "Bundesliga Survivor", gw: "GW37", locks: "Locks in 07h 30m", accent: "red", joined: 18 },
  { id: 4, name: "UCL Survivor", gw: "QF", locks: "Locks in 01d 10h", accent: "sky", joined: 16 },
  { id: 5, name: "Serie A Survivor", gw: "GW36", locks: "Locks in 09h 20m", accent: "amber", joined: 27 },
  { id: 6, name: "Ligue 1 Survivor", gw: "GW35", locks: "Locks in 12h 05m", accent: "rose", joined: 14 },
  { id: 7, name: "MLS Survivor", gw: "GW22", locks: "Locks in 1d 04h", accent: "cyan", joined: 8 },
];

const accentMap = {
  emerald: { border: "border-emerald-500/40", text: "text-emerald-400", btn: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  violet: { border: "border-violet-500/40", text: "text-violet-400", btn: "bg-violet-500/20 text-violet-300 border-violet-500/30" },
  red: { border: "border-red-500/40", text: "text-red-400", btn: "bg-red-500/15 text-red-400 border-red-500/30" },
  sky: { border: "border-sky-500/40", text: "text-sky-400", btn: "bg-sky-500/15 text-sky-400 border-sky-500/30" },
  amber: { border: "border-amber-500/40", text: "text-amber-400", btn: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  rose: { border: "border-rose-500/40", text: "text-rose-400", btn: "bg-rose-500/15 text-rose-400 border-rose-500/30" },
  cyan: { border: "border-cyan-500/40", text: "text-cyan-400", btn: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30" },
};

const accentBorder = {
  emerald: "border-l-emerald-500",
  violet: "border-l-violet-500",
  red: "border-l-red-500",
  zinc: "border-l-red-500/60",
};

function initialsFor(name) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

/* ---------- shared chrome ---------- */

function SubHeader({ title, onBack }) {
  return (
    <div className="flex items-center justify-between px-4 pt-4 pb-3">
      <button onClick={onBack} className="text-zinc-300 text-[18px]">←</button>
      <span className="text-white font-bold text-[15px]">{title}</span>
      <div className="w-[18px]" />
    </div>
  );
}

function ExploreLeaguesScreen({ onBack }) {
  return (
    <>
      <SubHeader title="Explore Leagues" onBack={onBack} />
      <div className="px-4 pb-2 text-zinc-500 text-[11px]">Join a league and survive each Gameweek to win the vault.</div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-2 space-y-2.5">
        {allLeagues.map((l) => {
          const a = accentMap[l.accent];
          return (
            <div key={l.id} className={`flex items-center gap-3 bg-white/[0.03] border ${a.border} rounded-xl p-3`}>
              <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-[10px] font-bold text-zinc-900 shrink-0 relative">
                {initialsFor(l.name)}
                {l.hot && (
                  <span className="absolute -top-1.5 -right-1.5 text-[7px] font-bold text-emerald-400 bg-zinc-950 border border-emerald-500/40 rounded-full px-1 py-0.5">HOT</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-[13px] font-semibold leading-tight truncate">{l.name}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-zinc-500 text-[10px]">{l.gw}</span>
                  <span className={`flex items-center gap-1 text-[10px] font-medium ${a.text}`}>
                    <Clock size={9} /> {l.locks}
                  </span>
                </div>
                <div className="text-zinc-600 text-[9px] mt-0.5">{l.joined} joined</div>
              </div>
              <button className={`text-[11px] font-bold rounded-lg px-3 py-1.5 border shrink-0 ${a.btn}`}>
                Join
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}

function PublicFriendsLeaguesScreen({ onBack, onOpen }) {
  return (
    <>
      <SubHeader title="Friends Leagues" onBack={onBack} />
      <div className="px-4 pb-2 text-zinc-500 text-[11px]">
        Public leagues created by other players. Money, if any, is arranged directly between members — Knoxit never handles it.
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-2 space-y-2.5">
        {publicFriendsLeagues.map((f) => (
          <button
            key={f.id}
            onClick={() => onOpen(f)}
            className="w-full text-left bg-white/[0.03] border border-white/10 rounded-xl p-3"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-white text-[13px] font-semibold">{f.name}</span>
              {f.alreadyJoined ? (
                <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-2 py-0.5">Joined</span>
              ) : (
                <ChevronRight size={15} className="text-zinc-600" />
              )}
            </div>
            <div className="text-zinc-500 text-[10px] mb-2">by {f.creator} · {f.members} members</div>
            <div className="text-zinc-400 text-[11px] leading-snug line-clamp-2">{f.entryTerms}</div>
          </button>
        ))}
      </div>
    </>
  );
}

function FriendsLeagueRequestScreen({ league, onBack }) {
  const [requested, setRequested] = useState(false);
  const [message, setMessage] = useState("");
  return (
    <>
      <SubHeader title={league.name} onBack={onBack} />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-2">
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 mb-4">
          <div className="text-zinc-500 text-[10px] mb-1">CREATED BY</div>
          <div className="text-white text-[14px] font-semibold mb-3">{league.creator}</div>
          <div className="text-zinc-500 text-[10px] mb-1">MEMBERS</div>
          <div className="text-white text-[14px] font-semibold">{league.members} joined</div>
        </div>

        <div className="bg-amber-500/[0.06] border border-amber-500/20 rounded-xl p-4 mb-4">
          <div className="text-amber-400 text-[10px] font-bold mb-1.5">ENTRY TERMS (set by creator)</div>
          <div className="text-zinc-200 text-[12px] leading-relaxed">{league.entryTerms}</div>
        </div>

        <div className="text-zinc-500 text-[10px] leading-relaxed px-1 mb-4">
          Knoxit only displays what the creator wrote here — we don't set, collect, or process any money. Any arrangement is directly between members.
        </div>

        {!league.alreadyJoined && !requested && (
          <>
            <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5">
              MESSAGE TO {league.creator.split(" ")[0]} <span className="text-zinc-600 font-normal">(optional)</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. I'm in, ready to send my share!"
              maxLength={200}
              rows={2}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5 text-white text-[13px] placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 resize-none"
            />
          </>
        )}
      </div>
      <div className="px-4 pb-4">
        {league.alreadyJoined ? (
          <div className="w-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-semibold text-[13px] rounded-xl py-3 text-center">
            You're already a member
          </div>
        ) : !requested ? (
          <button
            onClick={() => setRequested(true)}
            className="w-full bg-emerald-500 text-black font-bold text-[13px] rounded-xl py-3"
          >
            Request to Join
          </button>
        ) : (
          <div className="w-full bg-white/5 border border-white/10 text-zinc-300 font-semibold text-[13px] rounded-xl py-3 text-center">
            Request Sent — waiting on {league.creator.split(" ")[0]}
          </div>
        )}
      </div>
    </>
  );
}

function ManageRequestsScreen({ onBack }) {
  const [requests, setRequests] = useState(myAdminLeagueRequests);
  return (
    <>
      <SubHeader title="Join Requests" onBack={onBack} />
      <div className="px-4 pb-2 text-zinc-500 text-[11px]">People asking to join leagues you created.</div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-2 space-y-2.5">
        {requests.length === 0 && (
          <div className="text-center text-zinc-500 text-[12px] pt-16">No pending requests.</div>
        )}
        {requests.map((r) => (
          <div key={r.id} className="bg-white/[0.03] border border-white/10 rounded-xl p-3">
            <div className="mb-1">
              <div className="text-white text-[13px] font-semibold">{r.name}</div>
              <div className="text-zinc-500 text-[10px]">wants to join {r.forLeague}</div>
            </div>
            {r.message && (
              <div className="bg-white/[0.03] border border-white/5 rounded-lg px-2.5 py-2 my-2 text-zinc-300 text-[12px] italic">
                "{r.message}"
              </div>
            )}
            <div className="flex gap-1.5 mt-2">
              <button
                onClick={() => setRequests((rs) => rs.filter((x) => x.id !== r.id))}
                className="text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-lg px-2.5 py-1.5"
              >
                Approve
              </button>
              <button
                onClick={() => setRequests((rs) => rs.filter((x) => x.id !== r.id))}
                className="text-[11px] font-bold bg-white/5 text-zinc-400 border border-white/10 rounded-lg px-2.5 py-1.5"
              >
                Decline
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function JoinByCodeScreen({ onBack, onJoined }) {
  const [code, setCode] = useState("");
  const [state, setState] = useState("idle"); // idle | error | success
  const [message, setMessage] = useState("");

  const validCodes = { GULLY7: "Gully Legends", REUN2K: "College Reunion League" };

  const submit = () => {
    const upper = code.trim().toUpperCase();
    if (upper === "OFC99X") {
      setState("error");
      setMessage("You're already in this league.");
      return;
    }
    const name = validCodes[upper];
    if (!name) {
      setState("error");
      setMessage("No league found with that code. Double-check it and try again.");
      return;
    }
    setState("success");
    setMessage(`You're in! Welcome to ${name}.`);
    setTimeout(() => onJoined(), 1200);
  };

  return (
    <>
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <button onClick={onBack} className="text-zinc-300 text-[18px]">←</button>
        <span className="text-white font-bold text-[15px]">Join with Code</span>
        <div className="w-[18px]" />
      </div>
      <div className="flex-1 flex flex-col px-4 pt-6">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-violet-500/15 border border-violet-500/30 flex items-center justify-center mb-3">
            <KeyRound size={24} className="text-violet-300" />
          </div>
          <div className="text-white text-[15px] font-semibold text-center">Got an invite code?</div>
          <div className="text-zinc-500 text-[11px] text-center mt-1 max-w-[240px]">
            Enter the code your friend shared to join their league instantly — no approval needed.
          </div>
        </div>

        <input
          value={code}
          onChange={(e) => { setCode(e.target.value.toUpperCase()); setState("idle"); }}
          placeholder="e.g. GULLY7"
          maxLength={12}
          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-center text-white text-[16px] font-bold tracking-[0.2em] placeholder:text-zinc-600 placeholder:tracking-normal placeholder:font-normal focus:outline-none focus:border-violet-500/50"
        />

        {state === "error" && (
          <div className="mt-3 bg-red-500/10 border border-red-500/25 rounded-lg px-3 py-2 text-red-400 text-[12px] text-center">{message}</div>
        )}
        {state === "success" && (
          <div className="mt-3 bg-emerald-500/10 border border-emerald-500/25 rounded-lg px-3 py-2 text-emerald-400 text-[12px] text-center">{message}</div>
        )}

        <button
          onClick={submit}
          disabled={code.trim().length < 4}
          className="w-full mt-4 bg-violet-500 disabled:bg-white/5 disabled:text-zinc-600 text-black font-bold text-[13px] rounded-xl py-3"
        >
          Join League
        </button>

        <div className="text-zinc-600 text-[10px] text-center mt-4">
          Try GULLY7 or REUN2K to see it work, or OFC99X to see the "already joined" state.
        </div>
      </div>
    </>
  );
}

function generateCodeLocally() {
  const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  return code;
}

function CreateFriendsLeagueScreen({ onBack, onCreated }) {
  const [name, setName] = useState("");
  const [entryTerms, setEntryTerms] = useState("");
  const [visibility, setVisibility] = useState("invite_only");
  const [nameError, setNameError] = useState(null);
  const [created, setCreated] = useState(null);
  const [copied, setCopied] = useState(false);

  const submit = () => {
    setNameError(null);
    if (name.trim().length < 3) {
      setNameError("League name needs to be at least 3 characters.");
      return;
    }
    const clash = publicFriendsLeagues.some((f) => f.name.toLowerCase() === name.trim().toLowerCase());
    if (clash) {
      setNameError("A friends league with this name already exists. Try a different name.");
      return;
    }
    setCreated({ name: name.trim(), inviteCode: generateCodeLocally() });
  };

  const copyCode = () => {
    if (!created) return;
    navigator.clipboard?.writeText(created.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (created) {
    return (
      <>
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <button onClick={onBack} className="text-zinc-300 text-[18px]">←</button>
          <span className="text-white font-bold text-[15px]">League Created</span>
          <div className="w-[18px]" />
        </div>
        <div className="flex-1 flex flex-col items-center px-4 pt-8 text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-4">
            <CheckCircle2 size={26} className="text-emerald-400" />
          </div>
          <div className="text-white text-[17px] font-bold mb-1">{created.name} is live!</div>
          <div className="text-zinc-500 text-[12px] mb-6 max-w-[260px]">
            Share the code below with friends — entering it joins them instantly, no approval needed.
          </div>
          <div className="w-full bg-violet-500/[0.06] border border-violet-500/25 rounded-2xl p-4 mb-3">
            <div className="text-violet-300 text-[10px] font-bold mb-2 tracking-wide">INVITE CODE</div>
            <div className="flex items-center justify-between">
              <span className="text-white text-[26px] font-extrabold tracking-[0.25em]">{created.inviteCode}</span>
              <button onClick={copyCode} className="flex items-center gap-1 text-[11px] font-semibold text-violet-300 bg-violet-500/15 border border-violet-500/30 rounded-lg px-2.5 py-1.5">
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
          <button onClick={onCreated} className="w-full bg-emerald-500 text-black font-bold text-[13px] rounded-xl py-3 mt-2">
            Go to My Leagues
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <button onClick={onBack} className="text-zinc-300 text-[18px]">←</button>
        <span className="text-white font-bold text-[15px]">Create Friends League</span>
        <div className="w-[18px]" />
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-2 pb-4">
        <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5">LEAGUE NAME</label>
        <input
          value={name}
          onChange={(e) => { setName(e.target.value); setNameError(null); }}
          placeholder="e.g. Weekend Warriors"
          maxLength={60}
          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5 text-white text-[14px] placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 mb-1"
        />
        {nameError && <div className="text-red-400 text-[11px] mb-2">{nameError}</div>}
        <div className="text-zinc-600 text-[10px] mb-4">Must be unique — no two public friends leagues can share a name.</div>

        <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5">ENTRY TERMS <span className="text-zinc-600 font-normal">(optional)</span></label>
        <textarea
          value={entryTerms}
          onChange={(e) => setEntryTerms(e.target.value)}
          placeholder="e.g. ₹500 each, winner takes the pot, settled via UPI within the group"
          maxLength={500}
          rows={3}
          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5 text-white text-[13px] placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 resize-none mb-1"
        />
        <div className="text-zinc-600 text-[10px] mb-4">Write this yourselves if there's any arrangement — Knoxit only displays it, never sets, collects, or processes anything. There's no entry fee or member limit here; anyone with the code or an approved request can join.</div>

        <label className="block text-[11px] font-semibold text-zinc-400 mb-2">VISIBILITY</label>
        <div className="grid grid-cols-2 gap-2 mb-6">
          <button
            onClick={() => setVisibility("invite_only")}
            className={`flex flex-col items-center gap-1.5 rounded-xl border py-3 ${visibility === "invite_only" ? "border-violet-500/50 bg-violet-500/10" : "border-white/10 bg-white/[0.03]"}`}
          >
            <Lock size={16} className={visibility === "invite_only" ? "text-violet-300" : "text-zinc-500"} />
            <span className={`text-[11px] font-semibold ${visibility === "invite_only" ? "text-violet-300" : "text-zinc-400"}`}>Invite-only</span>
            <span className="text-[9px] text-zinc-600 px-2 text-center leading-tight">Only joinable via code</span>
          </button>
          <button
            onClick={() => setVisibility("public")}
            className={`flex flex-col items-center gap-1.5 rounded-xl border py-3 ${visibility === "public" ? "border-emerald-500/50 bg-emerald-500/10" : "border-white/10 bg-white/[0.03]"}`}
          >
            <Globe size={16} className={visibility === "public" ? "text-emerald-400" : "text-zinc-500"} />
            <span className={`text-[11px] font-semibold ${visibility === "public" ? "text-emerald-400" : "text-zinc-400"}`}>Public</span>
            <span className="text-[9px] text-zinc-600 px-2 text-center leading-tight">Discoverable, needs approval</span>
          </button>
        </div>

        <button onClick={submit} className="w-full bg-emerald-500 text-black font-bold text-[13px] rounded-xl py-3">
          Create League
        </button>
      </div>
    </>
  );
}

const accentText = { emerald: "text-emerald-400", violet: "text-violet-400" };
const accentBg = { emerald: "bg-emerald-500/10 border-emerald-500/25", violet: "bg-violet-500/10 border-violet-500/25" };

function PicksScreen({ onNavigate }) {
  return (
    <>
      <Header betaLabel="BETA" onNavigate={onNavigate} />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-1 pb-2">
        {lockingSoonPicks.length > 0 && (
          <div className="bg-red-500/10 border border-red-500/25 rounded-xl px-3 py-3 mb-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-500/15 flex items-center justify-center shrink-0">
              <AlertTriangle size={16} className="text-red-400" />
            </div>
            <div className="flex-1">
              <div className="text-white text-[12px] font-semibold">{lockingSoonPicks.length} picks locking soon</div>
              <div className="text-zinc-500 text-[10px]">Don't miss your chance to survive.</div>
            </div>
          </div>
        )}

        {lockingSoonPicks.length > 0 && (
          <div className="mb-5">
            <div className="text-[11px] font-bold text-red-400 tracking-wide mb-2">LOCKING SOON</div>
            <div className="space-y-2">
              {lockingSoonPicks.map((p) => (
                <button
                  key={p.leagueId}
                  onClick={() => onNavigate("pickSubmission", p.leagueId)}
                  className={`w-full flex items-center justify-between border rounded-xl px-3 py-2.5 ${accentBg[p.accent]}`}
                >
                  <div className="text-left">
                    <div className="text-white text-[13px] font-semibold">{p.leagueName}</div>
                    <div className="text-zinc-500 text-[10px]">{p.code} · {p.gw} · No pick submitted</div>
                  </div>
                  <div className={`flex items-center gap-1 text-[12px] font-bold ${accentText[p.accent]}`}>
                    <Clock size={12} /> {p.locksIn}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {liveNowPicks.length > 0 && (
          <div className="mb-5">
            <div className="text-[11px] font-bold text-zinc-400 tracking-wide mb-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> LIVE NOW
            </div>
            <div className="space-y-2">
              {liveNowPicks.map((p, i) => (
                <div key={i} className="bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-[13px] font-semibold">{p.leagueName}</span>
                    <span className="text-red-400 text-[10px] font-bold flex items-center gap-1"><Radio size={10} /> {p.minute}</span>
                  </div>
                  <div className="flex items-center justify-between text-[12px]">
                    <span className={p.winning ? "text-emerald-400 font-semibold" : "text-zinc-300"}>{p.team}</span>
                    <span className="text-white font-bold">{p.homeScore} - {p.awayScore}</span>
                    <span className="text-zinc-500">{p.opponent}</span>
                  </div>
                  <div className={`text-[10px] mt-1 font-medium ${p.winning ? "text-emerald-400" : "text-amber-400"}`}>
                    {p.winning ? "Winning" : "Drawing/Losing"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {awaitingResultsPicks.length > 0 && (
          <div className="mb-5">
            <div className="text-[11px] font-bold text-zinc-400 tracking-wide mb-2">AWAITING RESULTS</div>
            <div className="space-y-2">
              {awaitingResultsPicks.map((p, i) => (
                <div key={i} className="bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5 flex items-center justify-between">
                  <div>
                    <div className="text-white text-[13px] font-semibold">{p.leagueName}</div>
                    <div className="text-zinc-500 text-[10px]">{p.team} {p.opponent}</div>
                  </div>
                  <div className="text-amber-400 text-[10px] font-semibold flex items-center gap-1">
                    <Clock size={10} /> {p.kickoff}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {submittedPicks.length > 0 && (
          <div className="mb-4">
            <div className="text-[11px] font-bold text-zinc-400 tracking-wide mb-2">SUBMITTED PICKS</div>
            <div className="space-y-2">
              {submittedPicks.map((p) => (
                <div key={p.leagueId} className="bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-white text-[13px] font-semibold">{p.leagueName}</span>
                    <span className="text-emerald-400 text-[10px] font-semibold flex items-center gap-1">
                      <CheckCircle2 size={11} /> Locked
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    <span className="text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 rounded-md px-2 py-1">
                      Pick: {p.primary}
                    </span>
                    <span className="text-[10px] font-medium bg-white/[0.03] text-zinc-400 border border-white/10 rounded-md px-2 py-1">
                      Backup: {p.backup}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <BottomNav current="picks" onNavigate={onNavigate} />
    </>
  );
}

function PickSubmissionScreen({ onBack, onSubmitted }) {
  const [primary, setPrimary] = useState(null);
  const [backup, setBackup] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const selectPrimary = (team) => {
    if (usedTeamsThisCycle.includes(team)) return;
    setPrimary(team);
    if (backup === team) setBackup(null);
  };
  const selectBackup = (team) => {
    if (usedTeamsThisCycle.includes(team) || team === primary) return;
    setBackup(team);
  };
  const submit = () => {
    if (!primary) return;
    setSubmitted(true);
    setTimeout(onSubmitted, 1200);
  };

  if (submitted) {
    return (
      <>
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <button onClick={onBack} className="text-zinc-300 text-[18px]">←</button>
          <span className="text-white font-bold text-[15px]">Pick Submitted</span>
          <div className="w-[18px]" />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-4">
            <Check size={26} className="text-emerald-400" />
          </div>
          <div className="text-white text-[15px] font-bold mb-1">You're in the game.</div>
          <div className="text-zinc-500 text-[12px]">Pick locked: {primary}{backup ? ` (backup: ${backup})` : ""}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <button onClick={onBack} className="text-zinc-300 text-[18px]">←</button>
        <span className="text-white font-bold text-[15px]">Make Your Pick</span>
        <div className="w-[18px]" />
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-2 pb-4">
        <label className="block text-[11px] font-semibold text-zinc-400 mb-2">
          PRIMARY PICK <span className="text-zinc-600 font-normal">— team you haven't used this cycle</span>
        </label>
        <div className="grid grid-cols-2 gap-2 mb-5">
          {teamPool.map((team) => {
            const used = usedTeamsThisCycle.includes(team);
            const selected = primary === team;
            return (
              <button
                key={team}
                onClick={() => selectPrimary(team)}
                disabled={used}
                className={`text-[12px] font-semibold rounded-lg py-2.5 border ${
                  used ? "border-white/5 bg-white/[0.02] text-zinc-700 line-through cursor-not-allowed"
                  : selected ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-300"
                  : "border-white/10 bg-white/[0.03] text-zinc-300"
                }`}
              >
                {team}
              </button>
            );
          })}
        </div>

        <label className="block text-[11px] font-semibold text-zinc-400 mb-2">
          BACKUP PICK <span className="text-zinc-600 font-normal">(optional — only used if your primary match is postponed/abandoned, not if it just loses)</span>
        </label>
        <div className="grid grid-cols-2 gap-2 mb-6">
          {teamPool.map((team) => {
            const used = usedTeamsThisCycle.includes(team) || team === primary;
            const selected = backup === team;
            return (
              <button
                key={team}
                onClick={() => selectBackup(team)}
                disabled={used}
                className={`text-[12px] font-semibold rounded-lg py-2.5 border ${
                  used ? "border-white/5 bg-white/[0.02] text-zinc-700 line-through cursor-not-allowed"
                  : selected ? "border-amber-500/50 bg-amber-500/15 text-amber-300"
                  : "border-white/10 bg-white/[0.03] text-zinc-300"
                }`}
              >
                {team}
              </button>
            );
          })}
        </div>

        <button
          onClick={submit}
          disabled={!primary}
          className="w-full bg-emerald-500 disabled:bg-white/5 disabled:text-zinc-600 text-black font-bold text-[13px] rounded-xl py-3"
        >
          Lock In Pick
        </button>
      </div>
    </>
  );
}

function FormBadge({ result }) {
  const cls = result === "W" ? "bg-emerald-500/20 text-emerald-400"
    : result === "L" ? "bg-red-500/20 text-red-400"
    : "bg-zinc-600/30 text-zinc-400";
  return <span className={`w-4 h-4 rounded-full text-[8px] font-bold flex items-center justify-center ${cls}`}>{result}</span>;
}

function FixtureRow({ f }) {
  return (
    <div className="bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2.5 mb-2">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="text-white text-[13px] font-semibold">{f.home}</div>
          <div className="flex gap-1 mt-1">{f.homeForm.map((r, i) => <FormBadge key={i} result={r} />)}</div>
        </div>
        <div className="text-center px-3">
          {f.status === "completed" ? (
            <div className="text-white text-[15px] font-extrabold">{f.homeScore} - {f.awayScore}</div>
          ) : (
            <>
              <div className="text-zinc-300 text-[12px] font-bold">{f.time}</div>
              <div className="text-zinc-600 text-[9px]">{f.venue}</div>
            </>
          )}
        </div>
        <div className="flex-1 text-right">
          <div className="text-white text-[13px] font-semibold">{f.away}</div>
          <div className="flex gap-1 mt-1 justify-end">{f.awayForm.map((r, i) => <FormBadge key={i} result={r} />)}</div>
        </div>
      </div>
    </div>
  );
}

function FixturesScreen({ onNavigate }) {
  const [league, setLeague] = useState("epl");
  const [gw, setGw] = useState(currentGameweek);
  const fixtures = gameweekFixtures[gw] || [];
  const hasEarlier = gameweekFixtures[gw - 1] !== undefined;
  const hasLater = gameweekFixtures[gw + 1] !== undefined;

  return (
    <>
      <Header betaLabel="BETA" onNavigate={onNavigate} />
      <div className="px-4 flex items-center justify-between mb-1">
        <div>
          <div className="text-white text-[16px] font-extrabold">Fixtures</div>
          <div className="text-zinc-500 text-[10px]">Explore fixtures. Check form. Plan your picks.</div>
        </div>
        <div className="flex gap-2">
          <Search size={16} className="text-zinc-400" />
          <Filter size={16} className="text-zinc-400" />
        </div>
      </div>

      <div className="flex gap-2 px-4 pt-2 overflow-x-auto no-scrollbar">
        {fixturesLeagues.map((l) => (
          <button
            key={l.key}
            onClick={() => setLeague(l.key)}
            className={`shrink-0 text-[11px] font-semibold rounded-full px-3 py-1.5 border ${
              league === l.key ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400" : "border-white/10 text-zinc-400"
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <button
          onClick={() => hasEarlier && setGw((g) => g - 1)}
          disabled={!hasEarlier}
          className="w-8 h-8 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center disabled:opacity-30"
        >
          <ChevronLeft size={16} className="text-zinc-300" />
        </button>
        <div className="text-center">
          <div className="text-white text-[14px] font-bold">Gameweek {gw}</div>
          {gw === currentGameweek && <div className="text-emerald-400 text-[10px] font-medium">Current</div>}
        </div>
        <button
          onClick={() => hasLater && setGw((g) => g + 1)}
          disabled={!hasLater}
          className="w-8 h-8 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center disabled:opacity-30"
        >
          <ChevronRight size={16} className="text-zinc-300" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-2">
        {fixtures.map((f) => <FixtureRow key={f.id} f={f} />)}
        {fixtures.length === 0 && (
          <div className="text-center text-zinc-500 text-[12px] pt-12">No fixtures for this gameweek yet.</div>
        )}

        <div className="text-[11px] font-bold text-zinc-400 tracking-wide mb-2 mt-4">FORM GUIDE (LAST 5 MATCHES)</div>
        <div className="bg-white/[0.03] border border-white/5 rounded-xl overflow-hidden mb-2">
          {formGuide.map((t) => (
            <div key={t.rank} className="flex items-center gap-2 px-3 py-2 border-b border-white/5 last:border-0">
              <span className="text-zinc-500 text-[11px] w-4">{t.rank}</span>
              <span className="text-white text-[12px] font-medium flex-1">{t.team}</span>
              <div className="flex gap-1">{t.form.map((r, i) => <FormBadge key={i} result={r} />)}</div>
              <span className="text-white text-[12px] font-bold w-8 text-right">{t.points}</span>
            </div>
          ))}
        </div>
        <button className="text-emerald-400 text-[11px] font-medium mb-2">View Full Table</button>
      </div>
      <BottomNav current="fixtures" onNavigate={onNavigate} />
    </>
  );
}

const shopIconMap = { Zap, Eye, Clock, Equal, RotateCcw, BarChart3 };

function MerchCard({ item, featured }) {
  const a = merchAccent[item.accent] || merchAccent.blue;
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden">
      <div className={`relative bg-gradient-to-br ${a.from} ${a.via} to-transparent flex items-center justify-center ${featured ? "h-28" : "h-20"} overflow-hidden`}>
        <div className="absolute -right-8 top-3 rotate-45 bg-red-500/90 text-white text-[8px] font-bold tracking-wider px-8 py-0.5 shadow">
          COMING SOON
        </div>
        <div className="w-11 h-11 rounded-full bg-black/30 flex items-center justify-center">
          <Lock size={18} className="text-amber-400/90" />
        </div>
      </div>
      <div className="px-3 py-2.5">
        <div className="text-white text-[13px] font-bold">{item.name}</div>
        <div className="text-zinc-500 text-[10px]">{item.subtitle}</div>
      </div>
    </div>
  );
}

function ShopItemCard({ item, balance, onPurchase, adProgress, onWatchAd }) {
  const Icon = shopIconMap[item.icon] || Shield;
  const affordable = balance >= item.cost;
  const adsRequired = adsRequiredFor(item.cost);
  const adsReady = adProgress >= adsRequired;
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3">
      <div className="w-9 h-9 rounded-lg bg-emerald-500/15 flex items-center justify-center mb-2">
        <Icon size={16} className="text-emerald-400" />
      </div>
      <div className="text-white text-[13px] font-semibold mb-1">{item.name}</div>
      <div className="text-zinc-500 text-[10px] leading-snug mb-3">{item.description}</div>
      <button
        onClick={() => onPurchase(item)}
        disabled={!affordable}
        className="w-full flex items-center justify-center gap-1 bg-amber-500/15 disabled:bg-white/5 disabled:text-zinc-600 border border-amber-500/30 disabled:border-white/10 text-amber-300 text-[11px] font-bold rounded-lg py-1.5 mb-1.5"
      >
        <Coins size={11} /> {item.cost.toLocaleString()}
      </button>
      <button
        onClick={() => onWatchAd(item)}
        disabled={adsReady}
        className="w-full flex items-center justify-center gap-1 bg-violet-500/10 disabled:bg-emerald-500/15 border border-violet-500/25 disabled:border-emerald-500/40 text-violet-300 disabled:text-emerald-400 text-[10px] font-semibold rounded-lg py-1.5"
      >
        {adsReady ? <><Check size={10} /> Ready — Claim</> : <><PlayCircle size={10} /> Watch Ad ({adProgress}/{adsRequired})</>}
      </button>
    </div>
  );
}

function ShopScreen({ onNavigate }) {
  const [balance, setBalance] = useState(chipBalance);
  const [tab, setTab] = useState("boosters");
  const [claimed, setClaimed] = useState(dailyReward.claimedToday);
  const [purchaseMsg, setPurchaseMsg] = useState(null);
  const [adProgress, setAdProgress] = useState({});

  const claimDaily = () => {
    if (claimed) return;
    setBalance((b) => b + dailyReward.amount);
    setClaimed(true);
  };

  const purchase = (item) => {
    if (balance < item.cost) return;
    setBalance((b) => b - item.cost);
    setPurchaseMsg(`${item.name} purchased!`);
    setTimeout(() => setPurchaseMsg(null), 2000);
  };

  const watchAd = (item) => {
    const required = adsRequiredFor(item.cost);
    setAdProgress((prev) => {
      const current = prev[item.id] || 0;
      if (current >= required) {
        setPurchaseMsg(`${item.name} claimed via ads!`);
        setTimeout(() => setPurchaseMsg(null), 2000);
        return { ...prev, [item.id]: 0 };
      }
      return { ...prev, [item.id]: Math.min(current + 1, required) };
    });
  };

  const [featuredMerch, ...restMerch] = merchTeasers;

  return (
    <>
      <Header betaLabel="BETA" onNavigate={onNavigate} />
      <div className="px-4 flex items-center justify-between mb-2">
        <div>
          <div className="text-white text-[16px] font-extrabold">Shop</div>
          <div className="text-zinc-500 text-[10px]">Power up your survival. Spend smart. Survive longer.</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-2">
        {purchaseMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-lg px-3 py-2 mb-3 text-emerald-400 text-[12px] font-semibold text-center">
            {purchaseMsg}
          </div>
        )}

        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-500/15 flex items-center justify-center">
              <Gift size={16} className="text-amber-400" />
            </div>
            <div>
              <div className="text-white text-[12px] font-semibold">Daily Free Reward</div>
              <div className="text-zinc-500 text-[10px]">Come back tomorrow for more free chips!</div>
            </div>
          </div>
          <button
            onClick={claimDaily}
            disabled={claimed}
            className={`text-[11px] font-bold rounded-lg px-3 py-1.5 flex items-center gap-1 ${
              claimed ? "bg-white/5 text-zinc-500" : "bg-emerald-500 text-black"
            }`}
          >
            {claimed ? <><Check size={11} /> Claimed</> : `+${dailyReward.amount}`}
          </button>
        </div>

        <div className="flex gap-2 mb-3">
          {[{ key: "boosters", label: "Boosters" }, { key: "merch", label: "Merch" }].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 text-[11px] font-bold rounded-lg py-2 border ${
                tab === t.key ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400" : "border-white/10 text-zinc-400"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "boosters" && (
          <>
            <div className="grid grid-cols-2 gap-2 mb-5">
              {boosterItems.map((item) => (
                <ShopItemCard
                  key={item.id}
                  item={item}
                  balance={balance}
                  onPurchase={purchase}
                  adProgress={adProgress[item.id] || 0}
                  onWatchAd={watchAd}
                />
              ))}
            </div>

            <div className="text-[11px] font-bold text-zinc-400 tracking-wide mb-2">CHIP PACKS</div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {chipPacks.map((pack) => (
                <div key={pack.id} className="bg-white/[0.03] border border-white/10 rounded-xl p-3 relative">
                  {pack.bestValue && (
                    <span className="absolute top-2 right-2 text-[8px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 rounded-full px-1.5 py-0.5">
                      BEST VALUE
                    </span>
                  )}
                  <div className="flex items-center gap-1 mb-1">
                    <Coins size={14} className="text-amber-400" />
                    <span className="text-white text-[15px] font-extrabold">{pack.chips.toLocaleString()}</span>
                  </div>
                  <div className="text-zinc-500 text-[10px] mb-2">chips</div>
                  <button disabled className="w-full bg-white/5 border border-white/10 text-zinc-500 text-[11px] font-semibold rounded-lg py-1.5">
                    ₹{pack.priceINR} · Coming Soon
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "merch" && (
          <>
            <div className="mb-3">
              <MerchCard item={featuredMerch} featured />
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {restMerch.map((item) => (
                <MerchCard key={item.id} item={item} />
              ))}
            </div>
          </>
        )}

        <div className="border border-white/10 rounded-xl px-3 py-3 mb-2">
          <div className="text-emerald-400 text-[11px] font-bold mb-1">SAFE & FAIR ECONOMY</div>
          <div className="text-zinc-500 text-[10px] leading-relaxed">
            No pay-to-win. Every item is designed to enhance your strategy, not guarantee results.
          </div>
        </div>
      </div>
      <BottomNav current="shop" onNavigate={onNavigate} />
    </>
  );
}

const faqData = [
  { q: "What happens if my match is postponed?", a: "Postponed matches are excluded from that Gameweek's results for affected players." },
  { q: "Can I change my pick after submitting?", a: "Yes, up until lock time. Once locked, picks are final." },
  { q: "What's the difference between Friends Leagues and regular leagues?", a: "Regular leagues are public chip-entry competitions. Friends Leagues are invite-only or request-to-join, no entry fee or member cap." },
  { q: "Does Knoxit handle real money?", a: "Not this season. Everything runs on chips, which have no cash value." },
];

function MenuStaticPage({ title, onBack, children }) {
  return (
    <>
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <button onClick={onBack} className="text-zinc-300 text-[18px]">←</button>
        <span className="text-white font-bold text-[15px]">{title}</span>
        <div className="w-[18px]" />
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-2 pb-6 text-zinc-300 text-[13px] leading-relaxed space-y-4">
        {children}
      </div>
    </>
  );
}

function MenuSection({ heading, children }) {
  return (
    <div>
      <div className="text-white text-[13px] font-bold mb-1.5">{heading}</div>
      <div className="text-zinc-400 text-[12px] leading-relaxed">{children}</div>
    </div>
  );
}

function HowToPlayScreen({ onBack }) {
  return (
    <MenuStaticPage title="How to Play" onBack={onBack}>
      <MenuSection heading="The Basics">Each Gameweek, pick one team you think will win. If they win, you survive. If they draw or lose, you're knocked out — unless your backup pick saves you.</MenuSection>
      <MenuSection heading="Primary & Backup Picks">Backup is NOT a second guess — if your primary team's match is played and they draw or lose, you're eliminated. Backup only comes into play if your primary team's match is postponed or abandoned and doesn't get played at all.</MenuSection>
      <MenuSection heading="You Can't Repeat a Team">Once used, a team is unavailable until you've used every team in the pool. Then it resets.</MenuSection>
      <MenuSection heading="Last Survivor Wins">The league continues until one player remains — that survivor takes the vault.</MenuSection>
      <MenuSection heading="Splitting the Vault">At 5 or fewer survivors, anyone can propose splitting the vault evenly — every survivor must agree.</MenuSection>
      <MenuSection heading="Boosters">Chips can be spent in the Shop on small strategic edges like Draw Shield and League Pulse — never a guaranteed win.</MenuSection>
    </MenuStaticPage>
  );
}

function FAQScreen({ onBack }) {
  return (
    <MenuStaticPage title="FAQ / Help Center" onBack={onBack}>
      {faqData.map((f, i) => (
        <div key={i} className="border-b border-white/5 pb-4 last:border-0">
          <div className="text-white text-[13px] font-semibold mb-1">{f.q}</div>
          <div className="text-zinc-400 text-[12px]">{f.a}</div>
        </div>
      ))}
    </MenuStaticPage>
  );
}

function TermsScreen({ onBack }) {
  return (
    <MenuStaticPage title="Terms & Conditions" onBack={onBack}>
      <div className="text-zinc-500 text-[11px] italic mb-2">Placeholder text — replace with reviewed Terms before launch. This is not legal advice.</div>
      <MenuSection heading="Chips Have No Cash Value">Chips are a virtual, in-app resource with no real-world monetary value.</MenuSection>
      <MenuSection heading="Friends Leagues">Any prize arrangement in a Friends League's Entry Terms is strictly between its members. Knoxit does not set, collect, or process it.</MenuSection>
    </MenuStaticPage>
  );
}

function PrivacyScreen({ onBack }) {
  return (
    <MenuStaticPage title="Privacy Policy" onBack={onBack}>
      <div className="text-zinc-500 text-[11px] italic mb-2">Placeholder text — replace with reviewed Privacy Policy before launch. This is not legal advice.</div>
      <MenuSection heading="What We Collect">Account info, gameplay data, device/usage data.</MenuSection>
      <MenuSection heading="Third Parties">Supabase (hosting/auth), football-data.org (fixtures), any ad network once integrated.</MenuSection>
    </MenuStaticPage>
  );
}

function SupportScreen({ onBack }) {
  return (
    <MenuStaticPage title="Contact Support" onBack={onBack}>
      <MenuSection heading="Email">support@knoxit.app (placeholder)</MenuSection>
      <MenuSection heading="Response Time">We aim to respond within 24–48 hours.</MenuSection>
    </MenuStaticPage>
  );
}

function AboutScreen({ onBack }) {
  return (
    <MenuStaticPage title="About" onBack={onBack}>
      <MenuSection heading="Knoxit">A football survivor pool — last fan standing takes the vault.</MenuSection>
      <MenuSection heading="Version">v0.1.0 (Beta)</MenuSection>
    </MenuStaticPage>
  );
}

function ProfileScreen({ onBack, onNavigate }) {
  return (
    <>
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <button onClick={onBack} className="text-zinc-300 text-[18px]">←</button>
        <span className="text-white font-bold text-[15px]">Profile</span>
        <div className="w-[18px]" />
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-2 pb-4">
        <div className="flex flex-col items-center py-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400/50 flex items-center justify-center text-emerald-300 text-[18px] font-bold mb-2">YO</div>
          <div className="text-white text-[16px] font-bold">You</div>
        </div>
        <div className="bg-white/[0.03] border border-white/10 rounded-xl divide-y divide-white/5 mb-4">
          <div className="px-3 py-2.5 flex items-center justify-between">
            <span className="text-zinc-400 text-[12px]">Username</span>
            <span className="text-white text-[12px] font-medium">You</span>
          </div>
          <div className="px-3 py-2.5 flex items-center justify-between">
            <span className="text-zinc-400 text-[12px]">Chip Balance</span>
            <span className="text-amber-400 text-[12px] font-bold">6,200</span>
          </div>
        </div>
        <button onClick={() => onNavigate("menuSignOut")} className="w-full flex items-center gap-2.5 bg-white/[0.03] border border-white/10 rounded-xl px-3 py-3">
          <span className="text-zinc-200 text-[13px] font-medium flex-1 text-left">Sign Out</span>
          <ChevronRight size={14} className="text-zinc-700" />
        </button>
      </div>
    </>
  );
}

function NotificationsScreen({ onBack }) {
  const [prefs, setPrefs] = useState({ pickLockReminders: true, resultAlerts: true, chatMessages: true, friendsLeagueRequests: true });
  const labels = {
    pickLockReminders: { title: "Pick Lock Reminders", desc: "Get notified before your picks lock in" },
    resultAlerts: { title: "Result Alerts", desc: "Know instantly when a match affecting you finishes" },
    chatMessages: { title: "Chat Messages", desc: "New messages in your leagues' chat" },
    friendsLeagueRequests: { title: "Friends League Requests", desc: "When someone requests to join your league" },
  };
  return (
    <>
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <button onClick={onBack} className="text-zinc-300 text-[18px]">←</button>
        <span className="text-white font-bold text-[15px]">Notifications</span>
        <div className="w-[18px]" />
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-2 pb-4">
        <div className="bg-white/[0.03] border border-white/10 rounded-xl divide-y divide-white/5">
          {Object.keys(prefs).map((key) => (
            <div key={key} className="flex items-center justify-between px-3 py-3">
              <div className="pr-3">
                <div className="text-white text-[13px] font-medium">{labels[key].title}</div>
                <div className="text-zinc-500 text-[10px] mt-0.5">{labels[key].desc}</div>
              </div>
              <button
                onClick={() => setPrefs((p) => ({ ...p, [key]: !p[key] }))}
                className={`w-10 h-6 rounded-full flex items-center px-0.5 ${prefs[key] ? "bg-emerald-500" : "bg-white/10"}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${prefs[key] ? "translate-x-4" : "translate-x-0"}`} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function ReferEarnScreen({ onBack }) {
  const [copied, setCopied] = useState(false);
  const code = "YOU2025K";
  return (
    <>
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <button onClick={onBack} className="text-zinc-300 text-[18px]">←</button>
        <span className="text-white font-bold text-[15px]">Refer & Earn</span>
        <div className="w-[18px]" />
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-2 pb-4">
        <div className="flex flex-col items-center text-center py-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-3">
            <Gift size={24} className="text-emerald-400" />
          </div>
          <div className="text-white text-[15px] font-bold mb-1">Give 200, Get 200</div>
          <div className="text-zinc-500 text-[12px] max-w-[240px]">Share your code — when a friend uses it, you both get 200 chips.</div>
        </div>
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 mb-4">
          <div className="text-zinc-500 text-[10px] font-bold mb-2 tracking-wide">YOUR REFERRAL CODE</div>
          <div className="flex items-center justify-between">
            <span className="text-white text-[22px] font-extrabold tracking-[0.15em]">{code}</span>
            <button
              onClick={() => { navigator.clipboard?.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
              className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 rounded-lg px-2.5 py-1.5"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
        <div className="bg-white/[0.03] border border-white/10 rounded-xl px-3 py-3 flex items-center justify-between">
          <span className="text-zinc-400 text-[12px]">Friends referred so far</span>
          <span className="text-white text-[16px] font-bold">3</span>
        </div>
      </div>
    </>
  );
}

function InviteFriendsScreen({ onBack }) {
  return (
    <>
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <button onClick={onBack} className="text-zinc-300 text-[18px]">←</button>
        <span className="text-white font-bold text-[15px]">Invite Friends</span>
        <div className="w-[18px]" />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-14 h-14 rounded-full bg-violet-500/15 border border-violet-500/30 flex items-center justify-center mb-4">
          <Users size={24} className="text-violet-300" />
        </div>
        <div className="text-white text-[15px] font-bold mb-1">Bring your friends into the game</div>
        <div className="text-zinc-500 text-[12px] mb-6 max-w-[260px]">Send them your invite link. More survivors, more banter, bigger leagues.</div>
        <button className="w-full bg-emerald-500 text-black font-bold text-[13px] rounded-xl py-3">Share Invite Link</button>
      </div>
    </>
  );
}

function SignOutScreen({ onBack, onConfirm }) {
  return (
    <>
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <button onClick={onBack} className="text-zinc-300 text-[18px]">←</button>
        <span className="text-white font-bold text-[15px]">Sign Out</span>
        <div className="w-[18px]" />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="text-white text-[15px] font-bold mb-1">Sign out of Knoxit?</div>
        <div className="text-zinc-500 text-[12px] mb-6 max-w-[240px]">You'll need to sign back in to make picks or check your leagues.</div>
        <button onClick={onConfirm} className="w-full bg-white/5 border border-white/10 text-white font-bold text-[13px] rounded-xl py-3 mb-2">Sign Out</button>
        <button onClick={onBack} className="w-full text-zinc-400 text-[12px] py-2">Cancel</button>
      </div>
    </>
  );
}



function LeagueDetailTabs({ tab, setTab }) {
  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "chat", label: "Chat", badge: 9 },
    { key: "history", label: "History" },
  ];
  return (
    <div className="flex border-t border-white/5 bg-black/40 pt-2 pb-3">
      {tabs.map((t) => {
        const active = tab === t.key;
        return (
          <button key={t.key} onClick={() => setTab(t.key)} className="flex-1 flex flex-col items-center gap-0.5 relative">
            <span className={`text-[12px] font-semibold ${active ? "text-emerald-400" : "text-zinc-500"}`}>{t.label}</span>
            {t.badge && (
              <span className="absolute -top-1 right-[32%] bg-emerald-500 text-black text-[8px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">{t.badge}</span>
            )}
            {active && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-emerald-400 rounded-full" />}
          </button>
        );
      })}
    </div>
  );
}

function LeagueDetailScreen({ onBack, onOpenProfile, onViewAllSurvivors }) {
  const [tab, setTab] = useState("overview");
  const d = leagueDetailData;
  const splitEligible = d.aliveCount <= 5;

  const [splitStatus, setSplitStatus] = useState(null); // null | "voting" | "success" | "failed"
  const [votes, setVotes] = useState([]);

  const [chatMessages, setChatMessages] = useState(d.chat);
  const [draft, setDraft] = useState("");
  const sendMessage = () => {
    if (!draft.trim()) return;
    setChatMessages((msgs) => [...msgs, { user: "You", text: draft.trim(), time: "now" }]);
    setDraft("");
  };

  const proposeSplit = () => {
    setVotes(d.survivors.map((s) => ({ id: s.id, name: s.name, isYou: s.isYou, status: s.isYou ? "agreed" : "pending" })));
    setSplitStatus("voting");
  };

  const cycleVote = (id) => {
    setVotes((vs) => {
      const next = vs.map((v) => {
        if (v.id !== id || v.isYou) return v;
        const order = { pending: "agreed", agreed: "declined", declined: "pending" };
        return { ...v, status: order[v.status] };
      });
      if (next.some((v) => v.status === "declined")) setSplitStatus("failed");
      else if (next.every((v) => v.status === "agreed")) setSplitStatus("success");
      else setSplitStatus("voting");
      return next;
    });
  };

  const resetSplit = () => {
    setSplitStatus(null);
    setVotes([]);
  };

  const splitShare = Math.floor(d.vault / d.aliveCount);

  return (
    <>
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <button onClick={onBack} className="text-zinc-300 text-[18px]">←</button>
        <div className="flex items-center gap-1.5">
          <span className="text-white font-bold text-[14px]">{d.name}</span>
          <span className="text-[9px] font-bold text-zinc-400 bg-white/5 border border-white/10 rounded px-1 py-0.5">{d.code}</span>
        </div>
        <Settings size={17} className="text-zinc-400" />
      </div>

      {tab === "overview" && (
        <div className="flex-1 overflow-y-auto no-scrollbar pb-2">
          <div className="grid grid-cols-2 gap-2 px-4">
            <div className="bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2">
              <div className="text-[10px] text-zinc-500">Gameweek</div>
              <div className="text-sm font-bold text-white">{d.gw}</div>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
              <div className="text-[10px] text-red-400 flex items-center gap-1"><Clock size={10} /> Locks In</div>
              <div className="text-sm font-bold text-red-400">{d.locksIn}</div>
            </div>
          </div>

          <div className="mx-4 mt-3 bg-gradient-to-b from-amber-500/[0.1] to-amber-500/[0.03] border-2 border-amber-500/40 rounded-2xl p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Lock size={12} className="text-amber-400" />
              <span className="text-[10px] font-bold text-amber-400 tracking-wider">SEALED PRIZE VAULT</span>
            </div>

            <div className="flex justify-center items-end h-14 mb-1 relative">
              {[0, 1, 2].map((i) => (
                <svg
                  key={i}
                  width="40" height="40" viewBox="0 0 40 40"
                  className="absolute"
                  style={{
                    left: `calc(50% - 20px + ${(i - 1) * 16}px)`,
                    bottom: `${i * 4}px`,
                    zIndex: i,
                    animation: `chipFloat 2.6s ease-in-out ${i * 0.25}s infinite`,
                  }}
                >
                  <circle cx="20" cy="20" r="18" fill="#B45309" />
                  <circle cx="20" cy="20" r="18" fill="none" stroke="#FCD34D" strokeWidth="1.5" strokeDasharray="3 3" />
                  <circle cx="20" cy="20" r="13" fill="#F59E0B" />
                  <path d="M20 10 L23.5 17 L31 18 L25.5 23 L27 30.5 L20 26.5 L13 30.5 L14.5 23 L9 18 L16.5 17 Z" fill="#FDE68A" opacity="0.85" />
                </svg>
              ))}
            </div>

            <div className="text-amber-300 font-extrabold text-[32px] leading-tight">{d.vault.toLocaleString()}</div>
            <div className="text-[11px] text-zinc-400 mt-2">
              {d.aliveCount <= 3
                ? `FINAL ${d.aliveCount} · one of you takes it all`
                : "Winner takes it all · unlocks when the last survivor stands"}
            </div>
          </div>

          <div className="flex justify-between px-4 pt-3 text-[11px] text-zinc-500">
            <span>{d.aliveCount} survivors remain</span>
            <span>{d.joinedCount} joined</span>
          </div>

          {splitEligible && (
            <div className="mx-4 mt-3 bg-violet-500/[0.06] border border-violet-500/25 rounded-2xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Handshake size={13} className="text-violet-300" />
                <span className="text-[11px] font-bold text-violet-300 tracking-wide">SPLIT THE VAULT</span>
              </div>

              {splitStatus === null && (
                <>
                  <div className="text-[11px] text-zinc-400 mb-2.5">
                    With {d.aliveCount} left, anyone can propose splitting the {d.vault.toLocaleString()} chip vault evenly. Every survivor must agree — even one no, and the league continues.
                  </div>
                  <button onClick={proposeSplit} className="w-full bg-violet-500/20 border border-violet-500/40 text-violet-200 font-bold text-[12px] rounded-lg py-2">
                    Propose Split
                  </button>
                </>
              )}

              {splitStatus === "voting" && (
                <>
                  <div className="text-[11px] text-zinc-400 mb-2">Waiting on everyone to agree · tap a name to simulate their vote</div>
                  <div className="space-y-1.5 mb-2">
                    {votes.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => cycleVote(v.id)}
                        disabled={v.isYou}
                        className="w-full flex items-center justify-between bg-white/[0.03] border border-white/10 rounded-lg px-3 py-1.5"
                      >
                        <span className="text-[12px] text-white">{v.name}{v.isYou ? " (you)" : ""}</span>
                        {v.status === "agreed" && <span className="text-[10px] font-bold text-emerald-400">Agreed</span>}
                        {v.status === "pending" && <span className="text-[10px] font-medium text-zinc-500">Waiting...</span>}
                        {v.status === "declined" && <span className="text-[10px] font-bold text-red-400">Declined</span>}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {splitStatus === "success" && (
                <>
                  <div className="text-[12px] text-emerald-300 font-semibold mb-1">Everyone agreed! Vault split evenly.</div>
                  <div className="text-[11px] text-zinc-400">
                    {d.aliveCount} survivors × <span className="text-amber-300 font-bold">{splitShare.toLocaleString()} chips</span> each. League ends here — no elimination this week.
                  </div>
                </>
              )}

              {splitStatus === "failed" && (
                <>
                  <div className="text-[12px] text-red-400 font-semibold mb-1">Split failed — someone declined.</div>
                  <div className="text-[11px] text-zinc-400 mb-2.5">The league continues as normal. Anyone can propose again next Gameweek.</div>
                  <button onClick={resetSplit} className="w-full bg-white/5 border border-white/10 text-zinc-300 font-semibold text-[12px] rounded-lg py-2">
                    Dismiss
                  </button>
                </>
              )}
            </div>
          )}

          <div className="mx-4 mt-3 bg-emerald-500/[0.06] border border-emerald-500/20 rounded-2xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-emerald-400">YOUR PICK</span>
              {d.yourPick.live && (
                <span className="text-[10px] font-bold text-red-400 bg-red-500/15 px-2 py-0.5 rounded-full">LIVE {d.yourPick.minute}</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-lg bg-red-600/80 flex items-center justify-center text-white font-bold text-xs">
                {initialsFor(d.yourPick.team)}
              </div>
              <div className="flex-1">
                <div className="text-white font-bold text-[15px]">{d.yourPick.team}</div>
                <div className="text-[11px] text-zinc-500">Backup: <span className="text-amber-400">{d.yourPick.backup}</span></div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5 text-[13px]">
              <span className="text-zinc-300">{d.yourPick.home}</span>
              <span className="text-white font-bold">{d.yourPick.homeScore} - {d.yourPick.awayScore}</span>
              <span className="text-zinc-300">{d.yourPick.away}</span>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between items-center px-4 mb-2">
              <span className="text-[11px] font-semibold text-zinc-400">SURVIVORS ({d.aliveCount})</span>
              <button onClick={onViewAllSurvivors} className="text-[11px] text-emerald-400 flex items-center gap-0.5">View All <ChevronRight size={12} /></button>
            </div>
            <div className="flex gap-3 px-4 overflow-x-auto no-scrollbar">
              {d.survivors.map((s) => (
                <button key={s.id} onClick={() => onOpenProfile(s)} className="flex flex-col items-center gap-1 shrink-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-[11px] font-bold ${
                    s.isYou ? "bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300" : "bg-zinc-800 border border-white/10 text-zinc-300"
                  }`}>
                    {s.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-[10px] text-zinc-400 max-w-[48px] truncate">{s.name}</span>
                </button>
              ))}
              {d.extraSurvivors > 0 && (
                <div className="flex flex-col items-center gap-1 shrink-0 justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-[11px] font-bold text-zinc-400">+{d.extraSurvivors}</div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between items-center px-4 mb-2">
              <span className="text-[11px] font-semibold text-zinc-400">KNOCKED OUT ({d.knockedOut.length})</span>
              <button className="text-[11px] text-emerald-400 flex items-center gap-0.5">View All <ChevronRight size={12} /></button>
            </div>
            <div className="flex gap-3 px-4 overflow-x-auto no-scrollbar">
              {d.knockedOut.map((k) => (
                <div key={k.id} className="flex flex-col items-center gap-1 shrink-0">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-[11px] font-bold text-red-400">
                    {k.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-[10px] text-zinc-400 max-w-[48px] truncate">{k.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "chat" && (
        <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-3 pb-2">
          <div className="space-y-3">
            {chatMessages.map((m, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-emerald-400 text-[12px] font-semibold">{m.user}</span>
                  {m.tag && <span className="text-[9px] text-zinc-500 border border-white/10 rounded px-1">{m.tag}</span>}
                  <span className="text-zinc-600 text-[9px] ml-auto">{m.time}</span>
                </div>
                <div className="text-zinc-300 text-[12px]">{m.text}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-3">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              maxLength={500}
              className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-[12px] text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/50"
            />
            <button
              onClick={sendMessage}
              disabled={!draft.trim()}
              className="text-[11px] font-bold bg-emerald-500 disabled:bg-white/5 disabled:text-zinc-600 text-black rounded-lg px-3 py-2"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {tab === "history" && (
        <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-3 pb-2 space-y-2">
          {d.history.map((h) => (
            <div key={h.gw} className={`flex items-center justify-between rounded-xl px-3 py-2.5 border ${
              h.result === "Live" ? "border-amber-400/40 bg-amber-500/10" : "border-white/10 bg-white/[0.03]"
            }`}>
              <span className="text-white text-[13px] font-semibold">{h.gw}</span>
              <span className={`text-[12px] font-semibold ${h.result === "Live" ? "text-amber-400" : "text-emerald-400"}`}>{h.result}</span>
              <span className="text-zinc-500 text-[11px]">{h.alive} alive</span>
            </div>
          ))}
        </div>
      )}

      <LeagueDetailTabs tab={tab} setTab={setTab} />
    </>
  );
}

function OpponentProfileScreen({ onBack }) {
  const p = opponentProfileData;
  return (
    <>
      <SubHeader title="" onBack={onBack} />
      <div className="flex-1 overflow-y-auto no-scrollbar pb-2">
        <div className="flex flex-col items-center pt-2 pb-4 border-b border-white/5">
          <div className="w-16 h-16 rounded-full bg-zinc-800 border-2 border-emerald-400/50 flex items-center justify-center text-lg font-bold text-zinc-300 mb-2">
            {initialsFor(p.name)}
          </div>
          <div className="text-white font-bold text-[15px]">{p.name}</div>
          <div className="flex items-center gap-1 mt-1 text-emerald-400 text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> {p.status}
          </div>
          <div className="text-[10px] text-amber-400 mt-1">{p.streak}</div>
        </div>

        <div className="mx-4 mt-4 bg-white/[0.03] border border-white/5 rounded-xl p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[11px] font-semibold text-zinc-400">CURRENT PICK</span>
            <span className="text-[10px] text-amber-400 font-medium flex items-center gap-1">
              <Clock size={10} /> AWAITING RESULTS
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-bold text-[14px]">{p.currentPick.team}</div>
              <div className="text-[11px] text-zinc-500">Backup: {p.currentPick.backup}</div>
            </div>
            {p.currentPick.locked && (
              <div className="flex items-center gap-1 text-[10px] text-zinc-500 border border-white/10 rounded-lg px-2 py-1">
                <Lock size={10} /> Reveal after lock
              </div>
            )}
          </div>
        </div>

        <div className="mx-4 mt-4">
          <div className="text-[11px] font-semibold text-zinc-400 mb-2">SURVIVAL TIMELINE</div>
          <div className="space-y-1.5">
            {p.timeline.map((t) => (
              <div key={t.gw} className={`flex items-center justify-between rounded-lg px-3 py-2 text-[12px] ${
                !t.done ? "bg-amber-500/10 border border-amber-500/20" : "bg-white/[0.02]"
              }`}>
                <span className="text-zinc-400">{t.gw}</span>
                <span className={t.done ? "text-emerald-400" : "text-amber-400"}>{t.team}</span>
                {t.done ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Lock size={12} className="text-amber-400" />}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mx-4 mt-4">
          {p.stats.map((s) => (
            <div key={s.label} className="bg-white/[0.03] border border-white/5 rounded-xl py-2 text-center">
              <div className="text-white font-bold text-[14px]">{s.value}</div>
              <div className="text-[9px] text-zinc-500 mt-0.5 leading-tight">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mx-4 mt-4">
          <button className="flex-1 border border-white/10 rounded-xl py-2 text-[12px] text-zinc-300 font-medium">Message</button>
          <button className="flex-1 bg-emerald-500 rounded-xl py-2 text-[12px] text-black font-semibold">Compare</button>
        </div>
      </div>
    </>
  );
}

function Drawer({ open, onClose, onNavigate }) {
  if (!open) return null;
  const sections = [
    { label: "ACCOUNT", items: [
      { label: "Profile", screen: "menuProfile" },
      { label: "Notifications", screen: "menuNotifications" },
    ]},
    { label: "GROW", items: [
      { label: "Invite Friends", screen: "menuInvite" },
      { label: "Refer & Earn", screen: "menuRefer" },
    ]},
    { label: "HELP", items: [
      { label: "How to Play", screen: "menuHowToPlay" },
      { label: "FAQ / Help Center", screen: "menuFAQ" },
      { label: "Contact Support", screen: "menuSupport" },
    ]},
    { label: "LEGAL", items: [
      { label: "Terms & Conditions", screen: "menuTerms" },
      { label: "Privacy Policy", screen: "menuPrivacy" },
    ]},
    { label: "OTHER", items: [
      { label: "About", screen: "menuAbout" },
      { label: "Sign Out", screen: "menuSignOut" },
    ]},
  ];
  const go = (screen) => { onClose(); onNavigate(screen); };
  return (
    <div className="absolute inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-[240px] h-full bg-zinc-950 border-r border-white/10 overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <span className="text-white font-extrabold text-[16px] tracking-wide">KNOXIT</span>
          <button onClick={onClose}><XCircle size={18} className="text-zinc-400" /></button>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 border-y border-white/5 mb-2">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 text-[12px] font-bold">YO</div>
          <div>
            <div className="text-white text-[13px] font-semibold">You</div>
            <div className="text-zinc-500 text-[10px]">View profile</div>
          </div>
        </div>
        {sections.map((section) => (
          <div key={section.label} className="px-2 mb-2">
            <div className="text-zinc-600 text-[9px] font-bold tracking-wider px-2.5 py-1.5">{section.label}</div>
            {section.items.map((item) => (
              <button
                key={item.screen}
                onClick={() => go(item.screen)}
                className="w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg hover:bg-white/[0.03]"
              >
                <span className={`text-[13px] font-medium flex-1 text-left ${item.destructive ? "text-red-400" : "text-zinc-200"}`}>
                  {item.label}
                </span>
                <ChevronRight size={14} className="text-zinc-700" />
              </button>
            ))}
          </div>
        ))}
        <div className="px-4 py-4 text-zinc-700 text-[10px]">Knoxit v0.1.0 (Beta)</div>
      </div>
    </div>
  );
}

function Header({ betaLabel, onNavigate }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <>
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <button onClick={() => setDrawerOpen(true)}><Menu size={20} className="text-zinc-300" /></button>
        <div className="flex items-center gap-1.5">
          <span className="text-white font-extrabold text-[17px] tracking-wide">KNOXIT</span>
          <span className="text-[9px] font-bold text-amber-400 border border-amber-400/40 rounded-full px-1.5 py-0.5 leading-none">{betaLabel}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Bell size={18} className="text-zinc-300" />
          <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 rounded-full px-2 py-1">
            <Coins size={12} className="text-amber-400" />
            <span className="text-amber-400 text-[11px] font-bold">6,200</span>
          </div>
        </div>
      </div>
      {onNavigate && <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onNavigate={onNavigate} />}
    </>
  );
}

function BottomNav({ current, onNavigate }) {
  const items = [
    { key: "home", icon: HomeIcon, label: "Home" },
    { key: "myleagues", icon: Trophy, label: "My Leagues" },
    { key: "picks", icon: Target, label: "Picks" },
    { key: "fixtures", icon: Calendar, label: "Fixtures" },
    { key: "shop", icon: ShoppingBag, label: "Shop" },
  ];
  return (
    <div className="flex border-t border-white/5 bg-black/40 pt-2 pb-3">
      {items.map((t) => {
        const active = current === t.key;
        return (
          <button
            key={t.key}
            onClick={() => onNavigate(t.key)}
            className="flex-1 flex flex-col items-center gap-0.5"
          >
            <t.icon size={19} className={active ? "text-emerald-400" : "text-zinc-500"} />
            <span className={`text-[9px] ${active ? "text-emerald-400 font-semibold" : "text-zinc-500"}`}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function Placeholder({ label, onBack }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-6 relative">
      <button onClick={onBack} className="absolute top-0 left-4 text-zinc-400 text-[11px] font-medium">
        ← Back
      </button>
      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
        <Target size={20} className="text-zinc-600" />
      </div>
      <div className="text-white text-[13px] font-semibold mb-1">{label}</div>
      <div className="text-zinc-500 text-[11px]">Not built yet — coming up next in the design queue.</div>
    </div>
  );
}

/* ---------- Home screen ---------- */

function HomeScreen({ onNavigate }) {
  return (
    <>
      <Header betaLabel="BETA" onNavigate={onNavigate} />
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* Join New Leagues */}
        <div className="px-4 flex items-center justify-between mb-2">
          <span className="text-[12px] font-bold text-zinc-300 tracking-wide">JOIN NEW LEAGUES</span>
          <button onClick={() => onNavigate("exploreLeagues")} className="text-[11px] text-emerald-400 font-medium flex items-center gap-0.5">View All Leagues <ChevronRight size={12} /></button>
        </div>
        <div className="pl-4 flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {joinLeagues.map((l) => {
            const a = accentMap[l.accent];
            return (
              <div key={l.id} className={`shrink-0 w-[135px] bg-white/[0.03] border ${a.border} rounded-xl p-3 relative`}>
                {l.hot && (
                  <span className="absolute top-2 right-2 text-[8px] font-bold text-emerald-400 border border-emerald-500/40 rounded-full px-1.5 py-0.5">HOT</span>
                )}
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[9px] font-bold text-zinc-900 mb-2">
                  {initialsFor(l.name)}
                </div>
                <div className="text-white text-[13px] font-semibold leading-tight">{l.name}</div>
                <div className="text-white text-[13px] font-semibold leading-tight mb-2">{l.sub}</div>
                <div className="text-zinc-500 text-[10px] mb-1">{l.gw}</div>
                <div className={`flex items-center gap-1 text-[10px] font-medium mb-2.5 ${a.text}`}>
                  <Clock size={10} /> {l.locks}
                </div>
                <button onClick={() => onNavigate("joinConfirm")} className={`w-full text-center rounded-lg py-1.5 text-[11px] font-bold border ${a.btn}`}>
                  Join Now
                </button>
              </div>
            );
          })}
          <div className="shrink-0 w-2" />
        </div>

        {/* Friends Leagues */}
        <div className="px-4 flex items-center justify-between mt-5 mb-2">
          <span className="text-[12px] font-bold text-zinc-300 tracking-wide">FRIENDS LEAGUES</span>
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate("manageRequests")} className="text-[11px] text-amber-400 font-medium flex items-center gap-1">
              Requests <span className="bg-amber-500 text-black text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">2</span>
            </button>
            <button onClick={() => onNavigate("friendsLeagues")} className="text-[11px] text-emerald-400 font-medium flex items-center gap-0.5">View All <ChevronRight size={12} /></button>
          </div>
        </div>
        <div className="pl-4 flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {friendsLeagues.map((f) => (
            <div key={f.id} className="shrink-0 w-[160px] bg-white/[0.03] border border-white/10 rounded-xl p-3">
              <div className="flex -space-x-2 mb-2">
                {Array.from({ length: Math.min(4, f.members) }).map((_, i) => (
                  <div key={i} className="w-6 h-6 rounded-full bg-zinc-700 border-2 border-zinc-950 flex items-center justify-center text-[8px] font-bold text-zinc-300">
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
                {f.members > 4 && (
                  <div className="w-6 h-6 rounded-full bg-zinc-800 border-2 border-zinc-950 flex items-center justify-center text-[8px] font-bold text-zinc-400">
                    +{f.members - 4}
                  </div>
                )}
              </div>
              <div className="text-white text-[13px] font-semibold leading-tight">{f.name}</div>
              <div className="text-zinc-500 text-[10px] mb-2.5">{f.members} friends joined</div>
              <button onClick={() => onNavigate("leagueDetail")} className="w-full text-center rounded-lg py-1.5 text-[11px] font-bold border bg-emerald-500/15 text-emerald-400 border-emerald-500/30 flex items-center justify-center gap-1">
                Enter <ChevronRightCircle size={12} />
              </button>
            </div>
          ))}
          <button onClick={() => onNavigate("createFriendsLeague")} className="shrink-0 w-[130px] border border-dashed border-white/15 rounded-xl p-3 flex flex-col items-center justify-center text-center gap-1.5">
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
              <Plus size={15} className="text-zinc-400" />
            </div>
            <span className="text-[11px] text-zinc-400 font-medium leading-tight">Create Friends League</span>
          </button>
          <button onClick={() => onNavigate("joinByCode")} className="shrink-0 w-[130px] border border-dashed border-violet-500/25 bg-violet-500/[0.04] rounded-xl p-3 flex flex-col items-center justify-center text-center gap-1.5">
            <div className="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center">
              <KeyRound size={15} className="text-violet-300" />
            </div>
            <span className="text-[11px] text-violet-300 font-medium leading-tight">Join with Code</span>
          </button>
          <div className="shrink-0 w-2" />
        </div>

        {/* Your Dashboard */}
        <div className="px-4 mt-5 mb-2 text-[12px] font-bold text-zinc-300 tracking-wide">YOUR DASHBOARD</div>
        <div className="mx-4 bg-white/[0.02] border border-white/5 rounded-2xl p-3">
          <div className="grid grid-cols-4 gap-1">
            {dashboardStats.map((s) => (
              <div key={s.label} className="flex flex-col items-center text-center">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-1.5 ${s.accent === "emerald" ? "bg-emerald-500/15" : "bg-amber-500/15"}`}>
                  <s.icon size={16} className={s.accent === "emerald" ? "text-emerald-400" : "text-amber-400"} />
                </div>
                <div className={`font-extrabold ${s.big ? "text-[13px]" : "text-[16px]"} text-white`}>{s.value}</div>
                <div className="text-zinc-400 text-[9px] leading-tight mt-0.5">{s.label}</div>
                <div className={`text-[8px] leading-tight mt-0.5 ${s.subColor}`}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomNav current="home" onNavigate={onNavigate} />
    </>
  );
}

/* ---------- My Leagues screen ---------- */

function StatusIcon({ type, color }) {
  const cls = { emerald: "text-emerald-400", violet: "text-violet-400", red: "text-red-400" }[color];
  if (type === "check") return <CheckCircle2 size={13} className={cls} />;
  if (type === "clock") return <Clock size={13} className={cls} />;
  if (type === "live") return <Radio size={13} className={cls} />;
  if (type === "x") return <XCircle size={13} className={cls} />;
  return null;
}

function LeagueCard({ l, onClick, isFriends }) {
  const statusColorText = { emerald: "text-emerald-400", violet: "text-violet-400", red: "text-red-400" }[l.statusColor];
  return (
    <button onClick={onClick} className={`w-full text-left bg-white/[0.03] border border-white/5 border-l-[3px] ${accentBorder[l.accent]} rounded-xl p-3`}>
      <div className="flex items-start justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-[9px] font-bold text-zinc-300 shrink-0">
            {l.name.split(" ")[0].slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-white text-[13px] font-semibold leading-tight">{l.name}</span>
              <span className="text-[9px] font-bold text-zinc-400 bg-white/5 border border-white/10 rounded px-1 py-0.5">{l.code}</span>
              {isFriends && (
                <span className="text-[9px] font-bold text-violet-300 bg-violet-500/15 border border-violet-500/30 rounded px-1 py-0.5">Friends</span>
              )}
            </div>
            <div className="text-zinc-500 text-[10px] mt-0.5">{l.gw}</div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          {l.vault !== undefined && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/25 rounded-md px-1.5 py-0.5">
              <Coins size={9} /> {l.vault.toLocaleString()}
            </span>
          )}
          <ChevronRight size={16} className="text-zinc-600" />
        </div>
      </div>

      <div className="text-zinc-400 text-[11px] mb-2 pl-11">
        <span className="text-emerald-400 font-medium">{l.alive} still alive</span>
        <span className="mx-1">•</span>
        <span>{l.joined} joined</span>
      </div>

      <div className="flex items-center justify-between pl-11">
        <div className="flex gap-1.5">
          <span className="text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 rounded-md px-2 py-1">
            Pick: {l.pick}
          </span>
          <span className="text-[10px] font-medium bg-white/[0.03] text-zinc-400 border border-white/10 rounded-md px-2 py-1">
            Backup: {l.backup}
          </span>
        </div>
      </div>

      <div className={`flex items-center gap-1 mt-2 pl-11 text-[11px] font-semibold ${statusColorText}`}>
        <StatusIcon type={l.statusIcon} color={l.statusColor} />
        {l.status}
      </div>
    </button>
  );
}

function MyLeaguesScreen({ onNavigate }) {
  const [tab, setTab] = useState("active");
  const tabs = [
    { key: "active", label: "ACTIVE", count: 3 },
    { key: "friends", label: "FRIENDS", count: 2 },
    { key: "live", label: "LIVE", count: 1 },
    { key: "knocked", label: "KNOCKED OUT", count: null },
    { key: "won", label: "WON VAULTS", count: 0 },
  ];

  return (
    <>
      <Header betaLabel="BETA TEST" onNavigate={onNavigate} />
      <div className="px-4 mt-1">
        <div className="text-white text-[22px] font-extrabold leading-tight">My Leagues</div>
        <div className="text-zinc-500 text-[12px] mt-0.5">Your survival battles</div>
      </div>

      <div className="flex gap-4 px-4 mt-4 border-b border-white/5">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`pb-2.5 text-[11px] font-bold tracking-wide border-b-2 -mb-px whitespace-nowrap ${
              tab === t.key ? "border-emerald-400 text-emerald-400" : "border-transparent text-zinc-500"
            }`}
          >
            {t.label}{t.count !== null ? ` (${t.count})` : ""}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-3">
        {tab === "active" && (
          <div className="space-y-2.5">
            {activeLeagues.map((l) => <LeagueCard key={l.id} l={l} onClick={() => onNavigate("leagueDetail")} />)}
          </div>
        )}
        {tab === "friends" && (
          <div className="space-y-2.5">
            {friendsLeagues.map((l) => <LeagueCard key={l.id} l={l} isFriends onClick={() => onNavigate("leagueDetail")} />)}
          </div>
        )}
        {tab === "knocked" && (
          <div className="space-y-2.5">
            {knockedOutLeagues.map((l) => <LeagueCard key={l.id} l={l} onClick={() => onNavigate("leagueDetail")} />)}
          </div>
        )}
        {(tab === "live" || tab === "won") && (
          <div className="flex flex-col items-center justify-center pt-16 text-center">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
              <Trophy size={20} className="text-zinc-600" />
            </div>
            <div className="text-zinc-500 text-[12px]">Nothing here yet</div>
          </div>
        )}

        <div className="mt-4 mb-4 bg-emerald-500/[0.06] border border-emerald-500/20 rounded-xl px-3 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/15 flex items-center justify-center shrink-0">
            <Shield size={15} className="text-emerald-400" />
          </div>
          <div className="flex-1">
            <div className="text-white text-[11.5px] font-medium leading-tight">Compete in more leagues to increase your chances.</div>
            <div className="text-zinc-500 text-[10px] mt-0.5">Survive each Gameweek to unlock the vault.</div>
          </div>
        </div>
        <button onClick={() => onNavigate("exploreLeagues")} className="w-full mb-4 text-emerald-400 text-[12px] font-bold border border-emerald-500/30 rounded-xl py-2.5">
          Explore Leagues
        </button>
      </div>

      <BottomNav current="myleagues" onNavigate={onNavigate} />
    </>
  );
}

/* ---------- App shell ---------- */

export default function KnoxitApp() {
  const [screen, setScreen] = useState("home");
  const [prevScreen, setPrevScreen] = useState("home");
  const [selectedFriendsLeague, setSelectedFriendsLeague] = useState(null);

  const navigate = (next) => {
    const mainTabs = ["home", "myleagues", "picks", "fixtures", "shop"];
    setPrevScreen(mainTabs.includes(screen) ? screen : prevScreen);
    setScreen(next);
  };

  const openFriendsLeague = (league) => {
    setSelectedFriendsLeague(league);
    setScreen("friendsLeagueDetail");
  };

  const [pickSubmissionLeagueId, setPickSubmissionLeagueId] = useState(null);
  const navigateWithParam = (next, param) => {
    if (next === "pickSubmission") setPickSubmissionLeagueId(param);
    navigate(next);
  };

  const placeholderLabels = {
    joinConfirm: "Join League",
    allSurvivors: "All Survivors",
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-black p-4">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes chipFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
      <div className="w-[390px] h-full max-h-[820px] rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl bg-zinc-950 flex flex-col">
        {screen === "home" && <HomeScreen onNavigate={navigate} />}
        {screen === "myleagues" && <MyLeaguesScreen onNavigate={navigate} />}
        {screen === "picks" && <PicksScreen onNavigate={navigateWithParam} />}
        {screen === "fixtures" && <FixturesScreen onNavigate={navigate} />}
        {screen === "shop" && <ShopScreen onNavigate={navigate} />}
        {screen === "menuProfile" && <ProfileScreen onBack={() => setScreen(prevScreen)} onNavigate={navigate} />}
        {screen === "menuNotifications" && <NotificationsScreen onBack={() => setScreen(prevScreen)} />}
        {screen === "menuRefer" && <ReferEarnScreen onBack={() => setScreen(prevScreen)} />}
        {screen === "menuInvite" && <InviteFriendsScreen onBack={() => setScreen(prevScreen)} />}
        {screen === "menuHowToPlay" && <HowToPlayScreen onBack={() => setScreen(prevScreen)} />}
        {screen === "menuFAQ" && <FAQScreen onBack={() => setScreen(prevScreen)} />}
        {screen === "menuTerms" && <TermsScreen onBack={() => setScreen(prevScreen)} />}
        {screen === "menuPrivacy" && <PrivacyScreen onBack={() => setScreen(prevScreen)} />}
        {screen === "menuSupport" && <SupportScreen onBack={() => setScreen(prevScreen)} />}
        {screen === "menuAbout" && <AboutScreen onBack={() => setScreen(prevScreen)} />}
        {screen === "menuSignOut" && (
          <SignOutScreen onBack={() => setScreen(prevScreen)} onConfirm={() => setScreen("home")} />
        )}
        {screen === "pickSubmission" && (
          <PickSubmissionScreen onBack={() => setScreen("picks")} onSubmitted={() => setScreen("picks")} />
        )}
        {screen === "exploreLeagues" && <ExploreLeaguesScreen onBack={() => setScreen(prevScreen)} />}
        {screen === "friendsLeagues" && (
          <PublicFriendsLeaguesScreen onBack={() => setScreen(prevScreen)} onOpen={openFriendsLeague} />
        )}
        {screen === "friendsLeagueDetail" && selectedFriendsLeague && (
          <FriendsLeagueRequestScreen league={selectedFriendsLeague} onBack={() => setScreen("friendsLeagues")} />
        )}
        {screen === "manageRequests" && (
          <ManageRequestsScreen onBack={() => setScreen(prevScreen)} />
        )}
        {screen === "joinByCode" && (
          <JoinByCodeScreen onBack={() => setScreen(prevScreen)} onJoined={() => setScreen("myleagues")} />
        )}
        {screen === "createFriendsLeague" && (
          <CreateFriendsLeagueScreen onBack={() => setScreen(prevScreen)} onCreated={() => setScreen("myleagues")} />
        )}
        {screen === "leagueDetail" && (
          <LeagueDetailScreen
            onBack={() => setScreen(prevScreen)}
            onOpenProfile={() => navigate("opponentProfile")}
            onViewAllSurvivors={() => navigate("allSurvivors")}
          />
        )}
        {screen === "opponentProfile" && (
          <OpponentProfileScreen onBack={() => setScreen("leagueDetail")} />
        )}
        {placeholderLabels[screen] && (
          <>
            <Header betaLabel="BETA" onNavigate={navigate} />
            <Placeholder label={placeholderLabels[screen]} onBack={() => setScreen(prevScreen)} />
            <BottomNav current={prevScreen} onNavigate={navigate} />
          </>
        )}
      </div>
    </div>
  );
}
