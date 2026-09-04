import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession, getUserApps } from '@/lib/repo';
import { ProfileAppList } from '@/components/ProfileAppList';
import { ProfilePostButton } from '@/components/ProfilePostButton';
import { ArrowLeftIcon } from '@/components/icons';

export default async function ProfilePage() {
  const session = await getSession();

  if (!session) {
    redirect('/auth');
  }

  const apps = await getUserApps(session.user.id);
  const totalMrr = apps.reduce((sum, app) => sum + (app.mrr || 0), 0);
  const totalUpvotes = apps.reduce((sum, app) => sum + (app.upvotes || 0), 0);

  return (
    <main className="flex min-w-0 flex-1 justify-center overflow-y-scroll [scrollbar-gutter:stable] p-1">
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-slate-900"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to feed
          </Link>
        </div>

        {/* Profile Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-panel">
          <div className="flex items-center gap-4">
            {session.user.icon ? (
              <Image
                src={session.user.icon}
                alt={session.user.name}
                width={56}
                height={56}
                className="h-14 w-14 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-200 text-lg font-semibold uppercase text-slate-600">
                {session.user.name?.charAt(0) ?? '?'}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">{session.user.name}</h1>
                <span className="rounded-md bg-brand-50 px-2 py-0.5 text-xs font-medium capitalize text-brand-600">
                  {session.user.role}
                </span>
              </div>
              <p className="mt-0.5 text-sm text-slate-500">{session.user.email}</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4 text-center">
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-lg font-bold text-slate-900">{apps.length}</p>
              <p className="text-xs text-slate-500">Apps posted</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-lg font-bold text-slate-900">${totalMrr}</p>
              <p className="text-xs text-slate-500">Total MRR</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-lg font-bold text-slate-900">{totalUpvotes}</p>
              <p className="text-xs text-slate-500">Total Upvotes</p>
            </div>
          </div>
        </div>

        {/* App Management Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Your apps ({apps.length})
            </h2>
            <ProfilePostButton variant="link" />
          </div>

          {apps.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-panel">
              <span className="text-3xl">🚀</span>
              <h3 className="mt-3 text-base font-semibold text-slate-900">
                You haven&apos;t posted any apps yet
              </h3>
              <p className="mt-1 max-w-sm text-sm text-slate-500">
                Share your shitty AI creations with the community. No ideas or pitch decks required.
              </p>
              <ProfilePostButton variant="button" />
            </div>
          ) : (
            <ProfileAppList apps={apps} />
          )}
        </div>
      </div>
    </main>
  );
}
