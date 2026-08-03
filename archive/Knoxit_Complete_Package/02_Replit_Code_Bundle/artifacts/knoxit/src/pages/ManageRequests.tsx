// artifacts/knoxit/src/pages/ManageRequests.tsx
// Route: /friends-leagues/requests
import { useState } from "react";
import { SubHeader } from "../components/Header";
import { myAdminLeagueRequests } from "../lib/mockData";

export default function ManageRequests() {
  const [requests, setRequests] = useState(myAdminLeagueRequests);

  // TODO: wire both buttons to POST /api/friends-leagues/requests/:id/resolve
  // with { decision: "approve" | "decline" }, then remove locally on success.
  const resolve = (id: number) => setRequests((rs) => rs.filter((r) => r.id !== id));

  return (
    <>
      <SubHeader title="Join Requests" onBack={() => window.history.back()} />
      <div className="px-4 pb-2 text-zinc-500 text-[11px]">People asking to join leagues you created.</div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-2 space-y-2.5">
        {requests.length === 0 && (
          <div className="text-center text-zinc-500 text-[12px] pt-16">No pending requests.</div>
        )}
        {requests.map((r) => (
          <div key={r.id} className="bg-white/[0.03] border border-white/10 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1">
              <div>
                <div className="text-white text-[13px] font-semibold">{r.name}</div>
                <div className="text-zinc-500 text-[10px]">wants to join {r.forLeague}</div>
              </div>
            </div>
            {r.message && (
              <div className="bg-white/[0.03] border border-white/5 rounded-lg px-2.5 py-2 my-2 text-zinc-300 text-[12px] italic">
                "{r.message}"
              </div>
            )}
            <div className="flex gap-1.5 mt-2">
              <button onClick={() => resolve(r.id)} className="text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-lg px-2.5 py-1.5">
                Approve
              </button>
              <button onClick={() => resolve(r.id)} className="text-[11px] font-bold bg-white/5 text-zinc-400 border border-white/10 rounded-lg px-2.5 py-1.5">
                Decline
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
