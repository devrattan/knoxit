// artifacts/knoxit/src/pages/Home.tsx
import { useLocation } from "wouter";
import { Shield, Clock, Radio, Coins, ChevronRight, ChevronRightCircle, Plus, KeyRound } from "lucide-react";
import { Header } from "../components/Header";
import { BottomNav } from "../components/BottomNav";
import { joinLeagues, friendsLeagues, dashboardStats, accentMap, initialsFor } from "../lib/mockData";

const iconMap = { Shield, Clock, Radio, Coins };

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <>
      <Header betaLabel="BETA" />
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* Join New Leagues */}
        <div className="px-4 flex items-center justify-between mb-2">
          <span className="text-[12px] font-bold text-zinc-300 tracking-wide">JOIN NEW LEAGUES</span>
          <button onClick={() => setLocation("/leagues/explore")} className="text-[11px] text-emerald-400 font-medium flex items-center gap-0.5">
            View All Leagues <ChevronRight size={12} />
          </button>
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
                {/* TODO: wire to POST /api/leagues/:id/join */}
                <button className={`w-full text-center rounded-lg py-1.5 text-[11px] font-bold border ${a.btn}`}>
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
            <button onClick={() => setLocation("/friends-leagues/requests")} className="text-[11px] text-amber-400 font-medium flex items-center gap-1">
              Requests
              {/* TODO: real pending count from GET /api/friends-leagues/requests/mine */}
              <span className="bg-amber-500 text-black text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">2</span>
            </button>
            <button onClick={() => setLocation("/friends-leagues")} className="text-[11px] text-emerald-400 font-medium flex items-center gap-0.5">
              View All <ChevronRight size={12} />
            </button>
          </div>
        </div>
        <div className="pl-4 flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {friendsLeagues.map((f) => (
            <div key={f.id} className="shrink-0 w-[160px] bg-white/[0.03] border border-white/10 rounded-xl p-3">
              <div className="flex -space-x-2 mb-2">
                {Array.from({ length: Math.min(4, f.joined) }).map((_, i) => (
                  <div key={i} className="w-6 h-6 rounded-full bg-zinc-700 border-2 border-zinc-950 flex items-center justify-center text-[8px] font-bold text-zinc-300">
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div className="text-white text-[13px] font-semibold leading-tight">{f.name}</div>
              <div className="text-zinc-500 text-[10px] mb-2.5">{f.joined} friends joined</div>
              <button
                onClick={() => setLocation(`/leagues/${f.id}`)}
                className="w-full text-center rounded-lg py-1.5 text-[11px] font-bold border bg-emerald-500/15 text-emerald-400 border-emerald-500/30 flex items-center justify-center gap-1"
              >
                Enter <ChevronRightCircle size={12} />
              </button>
            </div>
          ))}
          <button
            onClick={() => setLocation("/friends-leagues/create")}
            className="shrink-0 w-[130px] border border-dashed border-white/15 rounded-xl p-3 flex flex-col items-center justify-center text-center gap-1.5"
          >
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
              <Plus size={15} className="text-zinc-400" />
            </div>
            <span className="text-[11px] text-zinc-400 font-medium leading-tight">Create Friends League</span>
          </button>
          <button
            onClick={() => setLocation("/friends-leagues/join-by-code")}
            className="shrink-0 w-[130px] border border-dashed border-violet-500/25 bg-violet-500/[0.04] rounded-xl p-3 flex flex-col items-center justify-center text-center gap-1.5"
          >
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
            {dashboardStats.map((s) => {
              const Icon = iconMap[s.icon as keyof typeof iconMap];
              return (
                <div key={s.label} className="flex flex-col items-center text-center">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-1.5 ${s.accent === "emerald" ? "bg-emerald-500/15" : "bg-amber-500/15"}`}>
                    <Icon size={16} className={s.accent === "emerald" ? "text-emerald-400" : "text-amber-400"} />
                  </div>
                  <div className={`font-extrabold ${s.big ? "text-[13px]" : "text-[16px]"} text-white`}>{s.value}</div>
                  <div className="text-zinc-400 text-[9px] leading-tight mt-0.5">{s.label}</div>
                  <div className={`text-[8px] leading-tight mt-0.5 ${s.subColor}`}>{s.sub}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
