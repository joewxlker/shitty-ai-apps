export default function FeedLoading() {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-card"
        >
          <div className="h-24 w-24 rounded-xl bg-slate-100 shrink-0" />
          <div className="flex-1 space-y-3 py-1">
            <div className="h-5 w-48 rounded bg-slate-200" />
            <div className="h-4 w-3/4 rounded bg-slate-100" />
            <div className="h-3 w-1/3 rounded bg-slate-100" />
            <div className="flex gap-3 pt-2">
              <div className="h-4 w-20 rounded bg-slate-100" />
              <div className="h-4 w-20 rounded bg-slate-100" />
            </div>
          </div>
          <div className="hidden w-40 flex-col gap-2 lg:flex">
            <div className="h-8 rounded-lg bg-slate-100" />
            <div className="h-8 rounded-lg bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
