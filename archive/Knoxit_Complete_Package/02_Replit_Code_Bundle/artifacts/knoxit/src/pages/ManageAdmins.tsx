// artifacts/knoxit/src/pages/ManageAdmins.tsx
// Route: /leagues/:id/manage-admins — creator-only screen
import { useState } from "react";
import { Shield, ShieldCheck } from "lucide-react";
import { SubHeader } from "../components/Header";
import { weekendWarriorsMembers } from "../lib/mockData";

export default function ManageAdmins() {
  const [members, setMembers] = useState(weekendWarriorsMembers);

  const toggleAdmin = (userId: string) => {
    // TODO: replace with POST /api/friends-leagues/:id/members/:userId/set-admin
    // Body: { isAdmin: <new value> }. Server rejects this for the creator's
    // own row and for anyone but the creator making the request.
    setMembers((ms) => ms.map((m) => (m.userId === userId && !m.isCreator ? { ...m, isAdmin: !m.isAdmin } : m)));
  };

  return (
    <>
      <SubHeader title="Manage Admins" onBack={() => window.history.back()} />
      <div className="px-4 pb-2 text-zinc-500 text-[11px]">
        Admins can approve or decline join requests alongside you. They can't delete the league or remove you.
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-2 space-y-2">
        {members.map((m) => (
          <div key={m.userId} className="flex items-center justify-between bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-[10px] font-bold text-zinc-300">
                {m.username.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="text-white text-[13px] font-medium">{m.username}</div>
                {m.isCreator && <div className="text-amber-400 text-[10px] font-semibold">Creator</div>}
              </div>
            </div>

            {m.isCreator ? (
              <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/25 rounded-full px-2.5 py-1">
                <ShieldCheck size={11} /> Always admin
              </span>
            ) : (
              <button
                onClick={() => toggleAdmin(m.userId)}
                className={`flex items-center gap-1 text-[10px] font-bold rounded-full px-2.5 py-1 border ${
                  m.isAdmin
                    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/25"
                    : "text-zinc-500 bg-white/[0.03] border-white/10"
                }`}
              >
                <Shield size={11} /> {m.isAdmin ? "Admin" : "Make Admin"}
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
