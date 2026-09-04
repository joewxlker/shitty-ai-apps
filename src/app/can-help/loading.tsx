export default function CanHelpLoading() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="flex flex-wrap gap-2">
        {[72, 96, 110, 88, 104].map((width, index) => (
          <div
            key={index}
            className="h-8 animate-pulse rounded-full border border-slate-200"
            style={{ width }}
          />
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4"
          >
            <div className="h-32 w-full rounded-xl bg-slate-100" />
            <div className="h-4 w-32 rounded bg-slate-200" />
            <div className="h-3 w-48 rounded bg-slate-100" />
            <div className="h-6 w-full rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
