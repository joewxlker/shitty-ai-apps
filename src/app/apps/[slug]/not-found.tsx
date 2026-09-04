import Link from 'next/link';
import { ArrowLeftIcon } from '@/components/icons';

export default function AppNotFound() {
  return (
    <main className="flex min-w-0 flex-1 justify-center overflow-y-scroll [scrollbar-gutter:stable] p-1">
      <div className="flex h-full min-h-[420px] w-full max-w-2xl flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-panel">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-3xl">
          🔍
        </div>
        <h1 className="text-xl font-bold text-slate-900">App Not Found</h1>
        <p className="mt-2 max-w-sm text-sm text-slate-500">
          The app you&apos;re looking for does not exist, may have been removed, or the slug in the URL is incorrect.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to feed
        </Link>
      </div>
    </main>
  );
}
