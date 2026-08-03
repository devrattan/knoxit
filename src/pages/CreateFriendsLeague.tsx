// artifacts/knoxit/src/pages/CreateFriendsLeague.tsx
// Route: /friends-leagues/create
import { useState } from "react";
import { useLocation } from "wouter";
import { MessageSquareText, Globe, Lock, Copy, Check } from "lucide-react";
import { SubHeader } from "../components/Header";
import { publicFriendsLeagues } from "../services/mockData";

function generateCodeLocally() {
  // TODO: this is a client-side stand-in for demo purposes only. The real
  // code comes from the server response of POST /api/leagues (see
  // generateUniqueInviteCode() in leagues.ts) — never trust a client-
  // generated code as the actual invite code once the backend is wired up.
  const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  return code;
}

export default function CreateFriendsLeague() {
  const [, setLocation] = useLocation();

  const [name, setName] = useState("");
  const [entryTerms, setEntryTerms] = useState("");
  const [visibility, setVisibility] = useState<"public" | "invite_only">("invite_only");

  const [nameError, setNameError] = useState<string | null>(null);
  const [created, setCreated] = useState<{ name: string; inviteCode: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const submit = () => {
    setNameError(null);

    if (name.trim().length < 3) {
      setNameError("League name needs to be at least 3 characters.");
      return;
    }

    // TODO: replace with POST /api/leagues — the real endpoint does this
    // same uniqueness check server-side (case-insensitive, friends leagues
    // only) and returns 409 with a friendly message if the name's taken.
    // No entryFeeChips or maxMembers sent — Friends Leagues have neither
    // (25 Jul 2026 decision): no entry fee, no member cap, no vault.
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
        <SubHeader title="League Created" onBack={() => setLocation("/")} />
        <div className="flex-1 flex flex-col items-center px-4 pt-8 text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-4">
            <Check size={26} className="text-emerald-400" />
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
                <Copy size={12} /> {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          <button
            onClick={() => setLocation("/my-leagues")}
            className="w-full bg-emerald-500 text-black font-bold text-[13px] rounded-xl py-3 mt-2"
          >
            Go to My Leagues
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <SubHeader title="Create Friends League" onBack={() => window.history.back()} />
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

        <label className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400 mb-1.5">
          <MessageSquareText size={12} /> ENTRY TERMS <span className="text-zinc-600 font-normal">(optional)</span>
        </label>
        <textarea
          value={entryTerms}
          onChange={(e) => setEntryTerms(e.target.value)}
          placeholder="e.g. ₹500 each, winner takes the pot, settled via UPI within the group"
          maxLength={500}
          rows={3}
          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5 text-white text-[13px] placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 resize-none mb-1"
        />
        <div className="text-zinc-600 text-[10px] mb-4">
          Write this yourselves if there's any arrangement — Knoxit only displays it, never sets, collects, or processes anything. There's no entry fee or member limit here; anyone with the code or an approved request can join.
        </div>

        <label className="block text-[11px] font-semibold text-zinc-400 mb-2">VISIBILITY</label>
        <div className="grid grid-cols-2 gap-2 mb-6">
          <button
            onClick={() => setVisibility("invite_only")}
            className={`flex flex-col items-center gap-1.5 rounded-xl border py-3 ${
              visibility === "invite_only" ? "border-violet-500/50 bg-violet-500/10" : "border-white/10 bg-white/[0.03]"
            }`}
          >
            <Lock size={16} className={visibility === "invite_only" ? "text-violet-300" : "text-zinc-500"} />
            <span className={`text-[11px] font-semibold ${visibility === "invite_only" ? "text-violet-300" : "text-zinc-400"}`}>Invite-only</span>
            <span className="text-[9px] text-zinc-600 px-2 text-center leading-tight">Only joinable via code</span>
          </button>
          <button
            onClick={() => setVisibility("public")}
            className={`flex flex-col items-center gap-1.5 rounded-xl border py-3 ${
              visibility === "public" ? "border-emerald-500/50 bg-emerald-500/10" : "border-white/10 bg-white/[0.03]"
            }`}
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
