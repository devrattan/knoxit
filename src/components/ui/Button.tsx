import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  loading?: boolean;
  children: ReactNode;
};

export function Button({ variant = "primary", loading, className, children, disabled, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-bold transition-colors disabled:opacity-50",
        variant === "primary" && "bg-emerald-500 text-black hover:bg-emerald-400",
        variant === "secondary" && "border border-white/10 bg-white/[0.04] text-zinc-100 hover:bg-white/[0.07]",
        variant === "danger" && "border border-red-500/30 bg-red-500/15 text-red-300 hover:bg-red-500/20",
        variant === "ghost" && "text-zinc-300 hover:bg-white/[0.05]",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "Working..." : children}
    </button>
  );
}
