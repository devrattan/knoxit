import { Link } from "wouter";
import { AuthLayout } from "./AuthLayout";

export default function Signup() {
  return (
    <AuthLayout title="Create account">
      <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
        <label className="block text-sm text-zinc-300">
          Username
          <input className="mt-1 w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-white" required minLength={3} />
        </label>
        <label className="block text-sm text-zinc-300">
          Email
          <input className="mt-1 w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-white" type="email" required />
        </label>
        <label className="block text-sm text-zinc-300">
          Password
          <input className="mt-1 w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-white" type="password" required minLength={8} />
        </label>
        <button className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm font-bold text-zinc-300" disabled>
          Signup unavailable until auth provider is connected
        </button>
        <Link className="block text-center text-xs text-zinc-400" href="/login">Back to login</Link>
      </form>
    </AuthLayout>
  );
}
