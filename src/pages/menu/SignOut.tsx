import { useLocation } from "wouter";
import { LogOut } from "lucide-react";
import { useAppDispatch } from "../../app/hooks";
import { SubHeader } from "../../components/Header";
import { signedOut } from "../../features/auth/authSlice";
import { useLogoutMutation } from "../../services/api/knoxitApi";

export default function SignOut() {
  const dispatch = useAppDispatch();
  const [, setLocation] = useLocation();
  const [logout, { isLoading }] = useLogoutMutation();

  const confirmSignOut = async () => {
    try {
      await logout().unwrap();
    } finally {
      dispatch(signedOut());
      setLocation("/login");
    }
  };

  return (
    <>
      <SubHeader title="Sign Out" onBack={() => window.history.back()} />
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
          <LogOut size={24} className="text-zinc-400" />
        </div>
        <div className="text-white text-[15px] font-bold mb-1">Sign out of Knoxit?</div>
        <div className="text-zinc-500 text-[12px] mb-6 max-w-[240px]">
          You'll need to sign back in to make picks or check your leagues.
        </div>

        <button disabled={isLoading} onClick={confirmSignOut} className="w-full bg-white/5 border border-white/10 text-white font-bold text-[13px] rounded-xl py-3 mb-2 disabled:opacity-60">
          {isLoading ? "Signing out..." : "Sign Out"}
        </button>
        <button onClick={() => window.history.back()} className="w-full text-zinc-400 text-[12px] py-2">
          Cancel
        </button>
      </div>
    </>
  );
}
