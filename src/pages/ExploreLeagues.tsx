// artifacts/knoxit/src/pages/ExploreLeagues.tsx
// Route: /leagues/explore
import { Clock } from "lucide-react";
import { SubHeader } from "../components/Header";
import { allLeagues, accentMap, initialsFor } from "../services/mockData";

export default function ExploreLeagues() {
  return (
    <>
      <SubHeader title="Explore Leagues" onBack={() => window.history.back()} />
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
              {/* TODO: wire to POST /api/leagues/:id/join, then setLocation(`/leagues/${l.id}`) */}
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
