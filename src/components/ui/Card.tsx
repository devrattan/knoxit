import type { HTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div className={clsx("rounded-card border border-white/10 bg-white/[0.03]", className)} {...props}>
      {children}
    </div>
  );
}
