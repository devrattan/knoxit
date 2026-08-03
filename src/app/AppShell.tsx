import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-knoxit-bg text-zinc-100">
      <div className="mx-auto flex min-h-screen w-full max-w-[1180px] bg-zinc-950 shadow-glow md:my-6 md:min-h-[820px] md:rounded-2xl md:border md:border-[var(--theme-primary-border)]">
        <main className="flex min-h-screen w-full flex-col overflow-hidden md:min-h-[820px]">
          {children}
        </main>
      </div>
    </div>
  );
}
