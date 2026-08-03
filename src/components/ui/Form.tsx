import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

export function Field({
  label,
  error,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return (
    <label className="block text-sm text-zinc-300">
      {label}
      <input
        className="mt-1 w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-white"
        aria-invalid={Boolean(error)}
        {...props}
      />
      {error ? <span className="mt-1 block text-xs text-red-300">{error}</span> : null}
    </label>
  );
}

export function TextArea({
  label,
  error,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string }) {
  return (
    <label className="block text-sm text-zinc-300">
      {label}
      <textarea
        className="mt-1 w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-white"
        aria-invalid={Boolean(error)}
        {...props}
      />
      {error ? <span className="mt-1 block text-xs text-red-300">{error}</span> : null}
    </label>
  );
}
