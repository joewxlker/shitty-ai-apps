import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession, getUserProfileMetrics } from '@/lib/repo';
import { ArrowLeftIcon } from '@/components/icons';
import { ProfileTabs } from '@/components/profile/ProfileTabs';

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect('/auth');
  }

  const metrics = await getUserProfileMetrics(session.user.id);

  return (
    <main className="flex min-w-0 flex-1 justify-center overflow-y-scroll [scrollbar-gutter:stable] p-1">
      <div className="flex w-full flex-col gap-6">
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-slate-900"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to feed
          </Link>
        </div>

        {/* Navigation Tabs at the top */}
        <ProfileTabs
          appsCount={metrics.appsCount}
          inboundCount={metrics.inboundCount}
          outboundCount={metrics.outboundCount}
          pendingInboundCount={metrics.pendingInboundCount}
        />

        {/* Tab Content */}
        {children}
      </div>
    </main>
  );
}
