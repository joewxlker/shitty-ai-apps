export default function AppDetailLoading() {
  return (
    <main className="flex min-w-0 flex-1 justify-center overflow-y-scroll [scrollbar-gutter:stable] p-1">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-panel animate-pulse space-y-6">
        <div className="flex justify-between border-b border-slate-100 pb-4">
          <div className="h-4 w-16 rounded bg-slate-100" />
          <div className="h-5 w-5 rounded bg-slate-100" />
        </div>
        <div className="h-48 w-full rounded-2xl bg-slate-100" />
        <div className="space-y-2">
          <div className="h-6 w-48 rounded bg-slate-200" />
          <div className="h-4 w-3/4 rounded bg-slate-100" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 flex-1 rounded-lg bg-slate-200" />
          <div className="h-10 w-16 rounded-lg bg-slate-100" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-20 rounded bg-slate-200" />
          <div className="h-3 w-full rounded bg-slate-100" />
          <div className="h-3 w-4/5 rounded bg-slate-100" />
        </div>
      </div>
    </main>
  );
}
