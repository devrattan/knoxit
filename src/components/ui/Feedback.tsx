export function EmptyState({ title, body }: { title: string; body?: string }) {
  return (
    <div className="rounded-card border border-dashed border-white/10 p-5 text-center">
      <div className="text-sm font-bold text-zinc-200">{title}</div>
      {body ? <p className="mt-1 text-xs text-zinc-500">{body}</p> : null}
    </div>
  );
}

export function ErrorState({ title = "Something went wrong", onRetry }: { title?: string; onRetry?: () => void }) {
  return (
    <div className="rounded-card border border-red-500/20 bg-red-500/10 p-4">
      <div className="text-sm font-bold text-red-300">{title}</div>
      {onRetry ? (
        <button className="mt-3 text-xs font-bold text-red-200 underline" onClick={onRetry}>
          Retry
        </button>
      ) : null}
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-white/[0.06] ${className}`} />;
}
