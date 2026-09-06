export default function ProfileInboundLoading() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      {/* Header */}
      <div className="space-y-1 py-1">
        <div className="h-6 w-44 rounded bg-slate-200" />
        <div className="h-3 w-32 rounded bg-slate-100" />
      </div>

      {/* Toolbar Skeleton */}
      <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="h-8 flex-1 rounded-lg bg-slate-100" />
          <div className="flex items-center gap-2">
            <div className="h-8 w-28 rounded-lg bg-slate-100" />
            <div className="h-8 w-28 rounded-lg bg-slate-100" />
          </div>
        </div>
      </div>

      {/* Requests Cards Skeleton */}
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4"
          >
            {/* Top row */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="h-4 w-36 rounded bg-slate-200" />
              <div className="h-5 w-16 rounded-full bg-slate-100" />
            </div>

            {/* Sender row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-slate-200 shrink-0" />
                <div className="space-y-1.5">
                  <div className="h-4 w-28 rounded bg-slate-200" />
                  <div className="h-3 w-40 rounded bg-slate-100" />
                </div>
              </div>
              <div className="h-3 w-16 rounded bg-slate-100" />
            </div>

            {/* Message bubble */}
            <div className="h-14 rounded-lg bg-slate-50" />

            {/* Action buttons footer */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <div className="h-7 w-16 rounded-lg bg-slate-200" />
                <div className="h-7 w-16 rounded-lg bg-slate-100" />
              </div>
              <div className="h-3 w-24 rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
