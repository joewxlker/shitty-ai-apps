export default function LeaderboardLoading() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="flex items-center gap-4 border-b border-slate-100 p-4 last:border-none"
        >
          <div className="h-4 w-6 rounded bg-slate-100" />
          <div className="h-8 w-8 rounded-full bg-slate-100" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-40 rounded bg-slate-200" />
            <div className="h-3 w-64 rounded bg-slate-100" />
          </div>
          <div className="space-y-1 text-right">
            <div className="h-4 w-16 rounded bg-slate-200" />
            <div className="h-3 w-12 rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
