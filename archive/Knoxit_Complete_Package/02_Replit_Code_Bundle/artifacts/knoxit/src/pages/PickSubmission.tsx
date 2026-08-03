// artifacts/knoxit/src/pages/PickSubmission.tsx
// Route: /picks/submit/:leagueId
import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { Check } from "lucide-react";
import { SubHeader } from "../components/Header";
import { teamPool, usedTeamsThisCycle } from "../lib/mockData";

export default function PickSubmission() {
  const [, params] = useRoute("/picks/submit/:leagueId");
  const [, setLocation] = useLocation();

  const [primary, setPrimary] = useState<string | null>(null);
  const [backup, setBackup] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const selectPrimary = (team: string) => {
    if (usedTeamsThisCycle.includes(team)) return;
    setPrimary(team);
    if (backup === team) setBackup(null);
  };
  const selectBackup = (team: string) => {
    if (usedTeamsThisCycle.includes(team) || team === primary) return;
    setBackup(team);
  };

  const submit = () => {
    if (!primary) return;
    // TODO: replace with POST /api/picks { leagueId: params?.leagueId, gameweek, primaryTeam: primary, backupTeam: backup }
    setSubmitted(true);
    setTimeout(() => setLocation("/picks"), 1200);
  };

  if (submitted) {
    return (
      <>
        <SubHeader title="Pick Submitted" onBack={() => setLocation("/picks")} />
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
      <SubHeader title="Make Your Pick" onBack={() => window.history.back()} />
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
                  used
                    ? "border-white/5 bg-white/[0.02] text-zinc-700 line-through cursor-not-allowed"
                    : selected
                    ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-300"
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
                  used
                    ? "border-white/5 bg-white/[0.02] text-zinc-700 line-through cursor-not-allowed"
                    : selected
                    ? "border-amber-500/50 bg-amber-500/15 text-amber-300"
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
