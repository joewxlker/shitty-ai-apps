export default function ProfileOutboundLoading() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      {/* Header */}
      <div className="py-1">
        <div className="h-6 w-44 rounded bg-slate-200" />
      </div>

      {/* Toolbar Skeleton */}
      <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="h-8 flex-1 rounded-lg bg-slate-100" />
          <div className="h-8 w-28 rounded-lg bg-slate-100" />
        </div>
      </div>

      {/* Outbound Cards Skeleton */}
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4"
          >
            {/* Top row */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="h-5 w-40 rounded bg-slate-200" />
              <div className="h-5 w-24 rounded-full bg-slate-100" />
            </div>

            {/* Message bubble */}
            <div className="h-14 rounded-lg bg-slate-50" />

            {/* Footer */}
            <div className="flex items-center justify-between pt-1">
              <div className="h-3 w-48 rounded bg-slate-100" />
              <div className="h-3 w-16 rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
