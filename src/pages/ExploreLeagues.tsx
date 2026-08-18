// Route: /leagues/explore
import { useState } from "react";
import { Clock, Coins, RefreshCw } from "lucide-react";
import { useLocation } from "wouter";
import { SubHeader } from "../components/Header";
import { normalizeApiError } from "../services/api/error";
import {
  type CompetitiveLeagueCard,
  useGetCompetitiveLeaguesQuery,
  useJoinCompetitionMutation,
} from "../services/api/knoxitApi";

const accentByCompetition: Record<string, { border: string; text: string; button: string }> = {
  epl: { border: "border-emerald-500/40", text: "text-emerald-400", button: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  la_liga: { border: "border-violet-500/40", text: "text-violet-400", button: "bg-violet-500/20 text-violet-300 border-violet-500/30" },
  bundesliga: { border: "border-red-500/40", text: "text-red-400", button: "bg-red-500/15 text-red-400 border-red-500/30" },
  ucl: { border: "border-sky-500/40", text: "text-sky-400", button: "bg-sky-500/15 text-sky-400 border-sky-500/30" },
  serie_a: { border: "border-amber-500/40", text: "text-amber-400", button: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
};

function initialsFor(name: string) {
  return name.split(" ").slice(0, 2).map((word) => word[0]).join("").toUpperCase();
}

function lockLabel(locksAt: string | null) {
  if (!locksAt) return "Not open";
  const milliseconds = new Date(locksAt).getTime() - Date.now();
  if (milliseconds <= 0) return "Locked";
  const minutes = Math.ceil(milliseconds / 60_000);
  if (minutes < 60) return `Locks in ${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours < 24) return `Locks in ${hours}h ${remainingMinutes}m`;
  return `Locks in ${Math.floor(hours / 24)}d ${hours % 24}h`;
}

function CompetitionLogo({ competition }: { competition: CompetitiveLeagueCard }) {
  if (competition.emblem) {
    return <img src={competition.emblem} alt="" className="h-8 w-8 object-contain" />;
  }
  return <span>{initialsFor(competition.name)}</span>;
}

export default function ExploreLeagues() {
  const [, setLocation] = useLocation();
  const competitionsQuery = useGetCompetitiveLeaguesQuery();
  const [joinCompetition, joinState] = useJoinCompetitionMutation();
  const [joiningKey, setJoiningKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const join = async (competition: CompetitiveLeagueCard) => {
    if (!competition.available || competition.startingRound === null) return;
    setError(null);
    setJoiningKey(competition.competitionKey);
    try {
      const result = await joinCompetition({
        competitionKey: competition.competitionKey,
        startingRound: competition.startingRound,
        idempotencyKey: crypto.randomUUID(),
      }).unwrap();
      setLocation(`/leagues/${result.league.id}`);
    } catch (requestError) {
      setError(normalizeApiError(requestError).message);
    } finally {
      setJoiningKey(null);
    }
  };

  return (
    <>
      <SubHeader title="Explore Leagues" onBack={() => window.history.back()} />
      <div className="px-4 pb-2 text-zinc-500 text-[11px]">
        Choose a competition. Knoxit automatically places you in an open 20-player survivor league.
      </div>

      {error ? (
        <div className="mx-4 mt-2 rounded-lg border border-red-500/25 bg-red-500/10 px-3 py-2 text-center text-[11px] text-red-300">
          {error}
        </div>
      ) : null}

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-2 space-y-2.5">
        {competitionsQuery.isLoading ? (
          <div className="pt-16 text-center text-[12px] text-zinc-500">Loading competitions…</div>
        ) : null}

        {competitionsQuery.isError ? (
          <div className="pt-12 text-center">
            <div className="text-[12px] text-zinc-400">Could not load competitions.</div>
            <button
              onClick={() => competitionsQuery.refetch()}
              className="mt-3 inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-2 text-[11px] text-zinc-300"
            >
              <RefreshCw size={12} /> Try again
            </button>
          </div>
        ) : null}

        {competitionsQuery.data?.map((competition) => {
          const accent = accentByCompetition[competition.competitionKey] ?? accentByCompetition.epl;
          const isJoining = joinState.isLoading && joiningKey === competition.competitionKey;
          return (
            <div key={competition.competitionKey} className={`flex items-center gap-3 bg-white/[0.03] border ${accent.border} rounded-xl p-3`}>
              <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-[10px] font-bold text-zinc-900 shrink-0">
                <CompetitionLogo competition={competition} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-[13px] font-semibold leading-tight truncate">{competition.name} Survivor</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-zinc-500 text-[10px]">
                    {competition.startingRound === null ? "No open round" : `Starts GW${competition.startingRound}`}
                  </span>
                  <span className={`flex items-center gap-1 text-[10px] font-medium ${competition.available ? accent.text : "text-zinc-600"}`}>
                    <Clock size={9} /> {lockLabel(competition.locksAt)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-zinc-600 text-[9px] mt-0.5">
                  <span>{competition.joinedEntries} entries</span>
                  <span className="flex items-center gap-0.5"><Coins size={8} /> {competition.entryFeeChips === 0 ? "Free" : `${competition.entryFeeChips} chips`}</span>
                </div>
                {!competition.available && competition.unavailableReason ? (
                  <div className="mt-1 truncate text-[9px] text-zinc-600">{competition.unavailableReason}</div>
                ) : null}
              </div>
              <button
                onClick={() => join(competition)}
                disabled={!competition.available || joinState.isLoading}
                className={`text-[11px] font-bold rounded-lg px-3 py-1.5 border shrink-0 disabled:border-white/10 disabled:bg-white/5 disabled:text-zinc-600 ${accent.button}`}
              >
                {isJoining ? "Joining…" : "Join"}
              </button>
            </div>
          );
        })}

        {competitionsQuery.isSuccess && competitionsQuery.data.length === 0 ? (
          <div className="pt-16 text-center text-[12px] text-zinc-500">
            No competitions are cached yet. Run the backend football sync first.
          </div>
        ) : null}
      </div>
    </>
  );
}
