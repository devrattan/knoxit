// artifacts/knoxit/src/pages/Picks.tsx
// Route: /picks
//
// Purpose (25 Jul 2026 decision, kept deliberately distinct from My Leagues):
// My Leagues is organized BY LEAGUE (browse). This is organized BY URGENCY/
// ACTION across every league at once — its whole job is making sure nobody
// gets accidentally eliminated because they didn't realize multiple leagues
// were locking soon. Scoped to 4 sections for now (Locking Soon, Submitted,
// Live, Awaiting Results) — Pick History deferred, lowest urgency of the
// original 5 sections.

import { useLocation } from "wouter";
import { Clock, Radio, CheckCircle2, AlertTriangle } from "lucide-react";
import { Header } from "../components/Header";
import { BottomNav } from "../components/BottomNav";
import { lockingSoonPicks, submittedPicks, liveNowPicks, awaitingResultsPicks } from "../services/mockData";

const accentText: Record<string, string> = {
  emerald: "text-emerald-400",
  violet: "text-violet-400",
};
const accentBg: Record<string, string> = {
  emerald: "bg-emerald-500/10 border-emerald-500/25",
  violet: "bg-violet-500/10 border-violet-500/25",
};

export default function Picks() {
  const [, setLocation] = useLocation();

  return (
    <>
      <Header betaLabel="BETA" />
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
                  onClick={() => setLocation(`/picks/submit/${p.leagueId}`)}
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

        {lockingSoonPicks.length === 0 && submittedPicks.length === 0 && liveNowPicks.length === 0 && awaitingResultsPicks.length === 0 && (
          <div className="flex flex-col items-center justify-center pt-16 text-center">
            <div className="text-zinc-500 text-[12px]">No picks to manage right now.</div>
          </div>
        )}
      </div>
      <BottomNav />
    </>
  );
}
