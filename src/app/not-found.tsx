import Link from 'next/link';
import { ArrowLeftIcon } from '@/components/icons';

export default function NotFound() {
  return (
    <main className="flex min-w-0 flex-1 items-center justify-center p-4">
      <div className="flex w-full max-w-md flex-col items-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-panel">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-3xl">
          🔍
        </div>
        <h1 className="text-2xl font-bold text-slate-900">404 - Not Found</h1>
        <p className="mt-2 text-sm text-slate-500">
          The page or app you are looking for does not exist or has been removed.
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
