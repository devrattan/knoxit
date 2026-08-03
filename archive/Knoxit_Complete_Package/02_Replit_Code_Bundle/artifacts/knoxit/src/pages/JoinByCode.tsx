// artifacts/knoxit/src/pages/JoinByCode.tsx
// Route: /friends-leagues/join-by-code
import { useState } from "react";
import { useLocation } from "wouter";
import { KeyRound } from "lucide-react";
import { SubHeader } from "../components/Header";
import { publicFriendsLeagues } from "../lib/mockData";

export default function JoinByCode() {
  const [, setLocation] = useLocation();
  const [code, setCode] = useState("");
  const [state, setState] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = async () => {
    // TODO: replace with POST /api/friends-leagues/join-by-code { inviteCode: code }
    const match = publicFriendsLeagues.find((f) => f.inviteCode === code.trim().toUpperCase());
    if (!match) {
      setState("error");
      setMessage("No league found with that code. Double-check it and try again.");
      return;
    }
    if (match.alreadyJoined) {
      setState("error");
      setMessage("You're already in this league.");
      return;
    }
    setState("success");
    setMessage(`You're in! Welcome to ${match.name}.`);
    setTimeout(() => setLocation(`/leagues/${match.id}`), 1200);
  };

  return (
    <>
      <SubHeader title="Join with Code" onBack={() => window.history.back()} />
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
          onChange={(e) => {
            setCode(e.target.value.toUpperCase());
            setState("idle");
          }}
          placeholder="e.g. GULLY7"
          maxLength={12}
          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-center text-white text-[16px] font-bold tracking-[0.2em] placeholder:text-zinc-600 placeholder:tracking-normal placeholder:font-normal focus:outline-none focus:border-violet-500/50"
        />

        {state === "error" && (
          <div className="mt-3 bg-red-500/10 border border-red-500/25 rounded-lg px-3 py-2 text-red-400 text-[12px] text-center">
            {message}
          </div>
        )}
        {state === "success" && (
          <div className="mt-3 bg-emerald-500/10 border border-emerald-500/25 rounded-lg px-3 py-2 text-emerald-400 text-[12px] text-center">
            {message}
          </div>
        )}

        <button
          onClick={submit}
          disabled={code.trim().length < 4}
          className="w-full mt-4 bg-violet-500 disabled:bg-white/5 disabled:text-zinc-600 text-black font-bold text-[13px] rounded-xl py-3"
        >
          Join League
        </button>
      </div>
    </>
  );
}
