// artifacts/knoxit/src/pages/OpponentProfile.tsx
// Route: /leagues/:leagueId/opponent/:userId
import { useLocation, useRoute } from "wouter";
import { Clock, Lock, CheckCircle2 } from "lucide-react";
import { SubHeader } from "../components/Header";
import { opponentProfileData, initialsFor } from "../services/mockData";

export default function OpponentProfile() {
  const [, params] = useRoute("/leagues/:leagueId/opponent/:userId");
  const [, setLocation] = useLocation();
  const leagueId = ((params as { leagueId?: string } | null)?.leagueId) ?? "1";
  const p = opponentProfileData; // TODO: fetch by params?.userId once an endpoint exists

  return (
    <>
      <SubHeader title="" onBack={() => setLocation(`/leagues/${leagueId}`)} />
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
