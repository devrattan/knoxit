import { Link, useLocation } from "wouter";
import { AuthLayout } from "./AuthLayout";

export default function Login() {
  const [, setLocation] = useLocation();

  return (
    <AuthLayout title="Log in">
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          setLocation("/");
        }}
      >
        <label className="block text-sm text-zinc-300">
          Email
          <input className="mt-1 w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-white" type="email" required />
        </label>
        <label className="block text-sm text-zinc-300">
          Password
          <input className="mt-1 w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-white" type="password" required />
        </label>
        <button className="w-full rounded-lg bg-emerald-500 px-3 py-2 text-sm font-bold text-black">Log in</button>
        <div className="flex justify-between text-xs text-zinc-400">
          <Link href="/signup">Create account</Link>
          <Link href="/forgot-password">Forgot password?</Link>
        </div>
      </form>
    </AuthLayout>
  );
}
