// artifacts/knoxit/src/pages/LeagueDetail.tsx
//
// Route: /leagues/:id — reached from My Leagues or Home's Friends Leagues.
// Currently renders the single mock league regardless of :id. Once
// GET /api/leagues/:id is wired up (see the backend bundle), fetch by
// the route param instead of importing leagueDetailData directly.

import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { ChevronRight, Clock, Settings, Lock, Handshake } from "lucide-react";
import { leagueDetailData, initialsFor } from "../services/mockData";

function LeagueDetailTabs({ tab, setTab }: { tab: string; setTab: (t: "overview" | "chat" | "history") => void }) {
  const tabs = [
    { key: "overview" as const, label: "Overview" },
    { key: "chat" as const, label: "Chat", badge: 9 },
    { key: "history" as const, label: "History" },
  ];
  return (
    <div className="flex border-t border-white/5 bg-black/40 pt-2 pb-3">
      {tabs.map((t) => {
        const active = tab === t.key;
        return (
          <button key={t.key} onClick={() => setTab(t.key)} className="flex-1 flex flex-col items-center gap-0.5 relative">
            <span className={`text-[12px] font-semibold ${active ? "text-emerald-400" : "text-zinc-500"}`}>{t.label}</span>
            {t.badge && (
              <span className="absolute -top-1 right-[32%] bg-emerald-500 text-black text-[8px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                {t.badge}
              </span>
            )}
            {active && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-emerald-400 rounded-full" />}
          </button>
        );
      })}
    </div>
  );
}

type VoteEntry = { id: number; name: string; isYou?: boolean; status: "agreed" | "pending" | "declined" };

export default function LeagueDetail() {
  const [, params] = useRoute("/leagues/:id");
  const [, setLocation] = useLocation();
  const leagueId = ((params as { id?: string } | null)?.id) ?? "1";
  const [tab, setTab] = useState<"overview" | "chat" | "history">("overview");
  const d = leagueDetailData; // TODO: fetch by params?.id once GET /api/leagues/:id exists

  const splitEligible = d.aliveCount <= 5; // fixed threshold, per the Split feature design

  const [splitStatus, setSplitStatus] = useState<null | "voting" | "success" | "failed">(null);
  const [votes, setVotes] = useState<VoteEntry[]>([]);

  // TODO: replace with real history from GET /api/leagues/:id/messages,
  // then keep appending through the planned authenticated WebSocket/SSE
  // channel. This local state + optimistic send is a stand-in only.
  const [chatMessages, setChatMessages] = useState(d.chat);
  const [draft, setDraft] = useState("");
  const sendMessage = () => {
    if (!draft.trim()) return;
    setChatMessages((msgs) => [...msgs, { user: "You", text: draft.trim(), time: "now" }]);
    setDraft("");
    // TODO: await fetch(`/api/leagues/${params?.id}/messages`, { method: "POST", body: JSON.stringify({ content: draft.trim() }) })
  };

  const proposeSplit = () => {
    // TODO: replace with POST /api/leagues/:id/split/propose
    setVotes(d.survivors.map((s) => ({ id: s.id, name: s.name, isYou: s.isYou, status: s.isYou ? "agreed" : "pending" })));
    setSplitStatus("voting");
  };

  const cycleVote = (id: number) => {
    // TODO: replace with POST /api/split/:id/vote — this local cycling is
    // only here so the flow can be demoed without a live backend.
    setVotes((vs) => {
      const next = vs.map((v) => {
        if (v.id !== id || v.isYou) return v;
        const order = { pending: "agreed", agreed: "declined", declined: "pending" } as const;
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
        <button onClick={() => setLocation("/my-leagues")} className="text-zinc-300 text-[18px]">←</button>
        <div className="flex items-center gap-1.5">
          <span className="text-white font-bold text-[14px]">{d.name}</span>
          <span className="text-[9px] font-bold text-zinc-400 bg-white/5 border border-white/10 rounded px-1 py-0.5">{d.code}</span>
        </div>
        {/* TODO: only show/link this for Friends Leagues where the current user is the creator or a co-admin — competitive leagues don't have this concept */}
        <button onClick={() => setLocation(`/leagues/${leagueId}/manage-admins`)}>
          <Settings size={17} className="text-zinc-400" />
        </button>
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

          {/* Sealed Prize Vault */}
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

          {/* Split the Vault */}
          {splitEligible && (
            <div className="mx-4 mt-3 bg-violet-500/[0.06] border border-violet-500/25 rounded-2xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Handshake size={13} className="text-violet-300" />
                <span className="text-[11px] font-bold text-violet-300 tracking-wide">SPLIT THE VAULT</span>
              </div>

              {splitStatus === null && (
                <>
                  <div className="text-[11px] text-zinc-400 mb-2.5">
                    With {d.aliveCount} left, anyone can propose splitting the {d.vault.toLocaleString()} chip vault evenly.
                    Every survivor must agree — even one no, and the league continues.
                  </div>
                  <button onClick={proposeSplit} className="w-full bg-violet-500/20 border border-violet-500/40 text-violet-200 font-bold text-[12px] rounded-lg py-2">
                    Propose Split
                  </button>
                </>
              )}

              {splitStatus === "voting" && (
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
              )}

              {splitStatus === "success" && (
                <>
                  <div className="text-[12px] text-emerald-300 font-semibold mb-1">Everyone agreed! Vault split evenly.</div>
                  <div className="text-[11px] text-zinc-400">
                    {d.aliveCount} survivors × <span className="text-amber-300 font-bold">{splitShare.toLocaleString()} chips</span> each.
                    League ends here — no elimination this week.
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

          {/* Your Pick */}
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

          {/* Survivors */}
          <div className="mt-4">
            <div className="flex justify-between items-center px-4 mb-2">
              <span className="text-[11px] font-semibold text-zinc-400">SURVIVORS ({d.aliveCount})</span>
              <button onClick={() => setLocation(`/leagues/${leagueId}/survivors`)} className="text-[11px] text-emerald-400 flex items-center gap-0.5">
                View All <ChevronRight size={12} />
              </button>
            </div>
            <div className="flex gap-3 px-4 overflow-x-auto no-scrollbar">
              {d.survivors.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setLocation(`/leagues/${leagueId}/opponent/${s.id}`)}
                  className="flex flex-col items-center gap-1 shrink-0"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-[11px] font-bold ${
                    s.isYou ? "bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300" : "bg-zinc-800 border border-white/10 text-zinc-300"
                  }`}>
                    {s.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-[10px] text-zinc-400 max-w-[48px] truncate">{s.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Knocked Out — shown as avatars only, no scores */}
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
          {/*
            TODO: replace this whole chat block with:
            1. On mount: GET /api/leagues/:id/messages for history
            2. Subscribe to the Express WebSocket/SSE channel for this league
               (filtered to this leagueId) to append new messages live —
               see chat.ts's header comment for the planned transport
            3. Unsubscribe on unmount
            The optimistic local append below is a stand-in so the input
            feels real during design review; it does NOT persist or sync
            with other members yet.
          */}
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
