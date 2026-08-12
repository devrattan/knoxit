import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAppDispatch } from "../../../app/hooks";
import { normalizeApiError } from "../../../services/api/error";
import { useSignupMutation } from "../../../services/api/knoxitApi";
import { sessionLoaded } from "../authSlice";
import { AuthLayout } from "./AuthLayout";

export default function Signup() {
  const dispatch = useAppDispatch();
  const [, setLocation] = useLocation();
  const [signup, { isLoading }] = useSignupMutation();
  const [error, setError] = useState<string>();

  return (
    <AuthLayout title="Create account">
      <form
        className="space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();
          setError(undefined);
          const form = new FormData(event.currentTarget);
          const password = String(form.get("password") ?? "");
          const confirmPassword = String(form.get("confirmPassword") ?? "");
          if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
          }

          try {
            const result = await signup({
              username: String(form.get("username") ?? ""),
              email: String(form.get("email") ?? ""),
              password
            }).unwrap();
            dispatch(sessionLoaded(result.user));
            setLocation("/");
          } catch (requestError) {
            setError(normalizeApiError(requestError).message);
          }
        }}
      >
        {error ? <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-200">{error}</div> : null}
        <label className="block text-sm text-zinc-300">
          Username
          <input name="username" autoComplete="username" className="mt-1 w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-white" required minLength={3} maxLength={24} pattern="[A-Za-z0-9_]+" />
        </label>
        <label className="block text-sm text-zinc-300">
          Email
          <input name="email" autoComplete="email" className="mt-1 w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-white" type="email" required />
        </label>
        <label className="block text-sm text-zinc-300">
          Password
          <input name="password" autoComplete="new-password" className="mt-1 w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-white" type="password" required minLength={10} maxLength={128} />
        </label>
        <label className="block text-sm text-zinc-300">
          Confirm password
          <input name="confirmPassword" autoComplete="new-password" className="mt-1 w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-white" type="password" required minLength={10} maxLength={128} />
        </label>
        <button disabled={isLoading} className="w-full rounded-lg bg-[var(--theme-primary)] px-3 py-2 text-sm font-bold text-[var(--theme-primary-text)] disabled:opacity-60">
          {isLoading ? "Creating account..." : "Create account"}
        </button>
        <Link className="block text-center text-xs text-zinc-400" href="/login">Back to login</Link>
      </form>
    </AuthLayout>
  );
}
