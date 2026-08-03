// artifacts/knoxit/src/pages/Fixtures.tsx
// Route: /fixtures
//
// Rebuilt 25 Jul 2026: gameweek-based navigation (◀ Gameweek N ▶) replaces
// the earlier Today/Tomorrow/Upcoming sections entirely. Upcoming gameweeks
// show kickoff time + venue; completed gameweeks show the final score plus
// each team's last-5 form badges.
//
// Data sources once wired up (currently mockData):
// - Fixtures per gameweek: GET /api/fixtures (already exists per replit.md)
//   filtered by gameweek/matchday — add a ?matchday= param server-side if
//   the client-side filter here gets unwieldy with real data volume.
// - Form Guide table: GET /api/standings/:league (new — see standings.ts)

import { useState } from "react";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { Header } from "../components/Header";
import { BottomNav } from "../components/BottomNav";
import { fixturesLeagues, currentGameweek, gameweekFixtures, formGuide } from "../services/mockData";

function FormBadge({ result }: { result: string }) {
  const cls = result === "W" ? "bg-emerald-500/20 text-emerald-400"
    : result === "L" ? "bg-red-500/20 text-red-400"
    : "bg-zinc-600/30 text-zinc-400";
  return <span className={`w-4 h-4 rounded-full text-[8px] font-bold flex items-center justify-center ${cls}`}>{result}</span>;
}

function FixtureRow({ f }: { f: (typeof gameweekFixtures)[number][number] }) {
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

export default function Fixtures() {
  const [league, setLeague] = useState("epl");
  const [gw, setGw] = useState(currentGameweek);

  const fixtures = gameweekFixtures[gw] ?? [];
  const hasEarlier = gameweekFixtures[gw - 1] !== undefined;
  const hasLater = gameweekFixtures[gw + 1] !== undefined;

  return (
    <>
      <Header betaLabel="BETA" />
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
      <BottomNav />
    </>
  );
}
