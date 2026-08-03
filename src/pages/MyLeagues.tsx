// artifacts/knoxit/src/pages/MyLeagues.tsx
import { useState } from "react";
import { useLocation } from "wouter";
import { ChevronRight, Clock, CheckCircle2, XCircle, Radio, Shield, Trophy, Coins } from "lucide-react";
import { Header } from "../components/Header";
import { BottomNav } from "../components/BottomNav";
import { activeLeagues, friendsLeagues, knockedOutLeagues, accentBorder } from "../services/mockData";

type League = {
  id: number; code: string; name: string; gw: string; accent: string;
  alive: number; joined: number; pick: string; backup: string;
  status: string; statusIcon: string; statusColor: string; vault?: number;
};

function StatusIcon({ type, color }: { type: string; color: string }) {
  const cls = { emerald: "text-emerald-400", violet: "text-violet-400", red: "text-red-400" }[color as "emerald" | "violet" | "red"];
  if (type === "check") return <CheckCircle2 size={13} className={cls} />;
  if (type === "clock") return <Clock size={13} className={cls} />;
  if (type === "live") return <Radio size={13} className={cls} />;
  if (type === "x") return <XCircle size={13} className={cls} />;
  return null;
}

function LeagueCard({ l, isFriends }: { l: League; isFriends?: boolean }) {
  const [, setLocation] = useLocation();
  const statusColorText = { emerald: "text-emerald-400", violet: "text-violet-400", red: "text-red-400" }[l.statusColor as "emerald" | "violet" | "red"];

  return (
    <button
      onClick={() => setLocation(`/leagues/${l.id}`)}
      className={`w-full text-left bg-white/[0.03] border border-white/5 border-l-[3px] ${accentBorder[l.accent]} rounded-xl p-3`}
    >
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

export default function MyLeagues() {
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState<"active" | "friends" | "live" | "knocked" | "won">("active");

  const tabs = [
    { key: "active" as const, label: "ACTIVE", count: activeLeagues.length },
    { key: "friends" as const, label: "FRIENDS", count: friendsLeagues.length },
    { key: "live" as const, label: "LIVE", count: 1 },
    { key: "knocked" as const, label: "KNOCKED OUT", count: null },
    { key: "won" as const, label: "WON VAULTS", count: 0 },
  ];

  return (
    <>
      <Header betaLabel="BETA TEST" />
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
            {activeLeagues.map((l) => <LeagueCard key={l.id} l={l} />)}
          </div>
        )}
        {tab === "friends" && (
          <div className="space-y-2.5">
            {friendsLeagues.map((l) => <LeagueCard key={l.id} l={l} isFriends />)}
          </div>
        )}
        {tab === "knocked" && (
          <div className="space-y-2.5">
            {knockedOutLeagues.map((l) => <LeagueCard key={l.id} l={l} />)}
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
        <button
          onClick={() => setLocation("/leagues/explore")}
          className="w-full mb-4 text-emerald-400 text-[12px] font-bold border border-emerald-500/30 rounded-xl py-2.5"
        >
          Explore Leagues
        </button>
      </div>

      <BottomNav />
    </>
  );
}
