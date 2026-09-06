export default function ProfileAppsLoading() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between py-1">
        <div className="h-6 w-32 rounded bg-slate-200" />
        <div className="h-4 w-24 rounded bg-slate-100" />
      </div>

      {/* Toolbar Skeleton */}
      <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="h-8 flex-1 rounded-lg bg-slate-100" />
          <div className="h-8 w-28 rounded-lg bg-slate-100" />
          <div className="h-8 w-24 rounded-lg bg-slate-100" />
        </div>
      </div>

      {/* Cards Skeleton */}
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded bg-slate-200" />
                  <div className="h-5 w-40 rounded bg-slate-200" />
                  <div className="h-5 w-16 rounded bg-slate-100" />
                </div>
                <div className="h-4 w-3/4 rounded bg-slate-100" />
              </div>
              <div className="h-6 w-6 rounded bg-slate-100" />
            </div>

            <div className="flex items-center gap-4 pt-1">
              <div className="h-3 w-16 rounded bg-slate-100" />
              <div className="h-3 w-20 rounded bg-slate-100" />
              <div className="h-3 w-16 rounded bg-slate-100" />
              <div className="h-3 w-20 rounded bg-slate-100" />
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <div className="flex items-center gap-2">
                <div className="h-7 w-14 rounded-lg bg-slate-100" />
                <div className="h-7 w-14 rounded-lg bg-slate-100" />
              </div>
              <div className="h-7 w-16 rounded-lg bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
