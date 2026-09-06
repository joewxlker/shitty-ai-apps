import { Suspense } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Session } from '@/lib/types';
import {
  getSession,
  getUserApps,
  getUserInboundHelpOffers,
  getUserOutboundHelpOffers,
  getUserProfileMetrics,
} from '@/lib/repo';
import { CategoryPill } from '@/components/CategoryPill';
import { ProfilePostButton } from '@/components/ProfilePostButton';
import { ProfileCard } from '@/components/profile/ProfileCard';

export default async function ProfileOverviewPage() {
  const session = await getSession();

  if (!session) {
    redirect('/auth');
  }

  return (
    <Suspense fallback={<OverviewLoading />}>
      <OverviewContent userId={session.user.id} user={session.user} />
    </Suspense>
  );
}

async function OverviewContent({ userId, user }: { userId: string; user: Session['user'] }) {
  const [apps, inboundOffers, outboundOffers, metrics] = await Promise.all([
    getUserApps(userId),
    getUserInboundHelpOffers(userId, 3),
    getUserOutboundHelpOffers(userId, 3),
    getUserProfileMetrics(userId),
  ]);

  const previewApps = apps.slice(0, 3);

  return (
    <div className="flex flex-col gap-6">
      {/* Profile Card */}
      <ProfileCard
        user={user}
        stats={{
          appsCount: metrics.appsCount,
          totalMrr: metrics.totalMrr,
          totalUpvotes: metrics.totalUpvotes,
        }}
      />

      {/* 1. Brief Apps Preview */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-slate-900">Your Apps</h2>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
              {metrics.appsCount}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {metrics.appsCount > 0 && (
              <Link
                href="/profile/apps"
                className="text-xs font-medium text-brand-600 hover:text-brand-700"
              >
                View all ({metrics.appsCount}) &rarr;
              </Link>
            )}
            <ProfilePostButton variant="link" />
          </div>
        </div>

        {previewApps.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-6 text-center">
            <span className="text-xl">🚀</span>
            <p className="mt-1 text-xs text-slate-500">You haven&apos;t posted any apps yet.</p>
            <div className="mt-2">
              <ProfilePostButton variant="button" />
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white divide-y divide-slate-100">
            {previewApps.map((app) => (
              <Link
                key={app.id}
                href={`/apps/${app.slug}`}
                className="flex items-center justify-between p-3.5 transition-colors hover:bg-slate-50"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-xl">{app.emoji}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold text-slate-900">
                        {app.name}
                      </span>
                      <CategoryPill category={app.category} />
                      {app.needsHelpWith && (
                        <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                          Needs help
                        </span>
                      )}
                    </div>
                    <p className="truncate text-xs text-slate-500">{app.tagline}</p>
                  </div>
                </div>

                <div className="ml-3 flex shrink-0 items-center gap-3 text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">
                    ${app.mrr.toLocaleString()} MRR
                  </span>
                  <span>▲ {app.upvotes}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* 2. Brief Inbound Requests Preview */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-slate-900">Recent Inbound Requests</h2>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
              {metrics.inboundCount}
            </span>
          </div>

          {metrics.inboundCount > 0 && (
            <Link
              href="/profile/inbound"
              className="text-xs font-medium text-brand-600 hover:text-brand-700"
            >
              View all ({metrics.inboundCount}) &rarr;
            </Link>
          )}
        </div>

        {inboundOffers.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white p-4 text-center">
            <p className="text-xs text-slate-500">No inbound requests yet.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white divide-y divide-slate-100">
            {inboundOffers.map((offer) => (
              <Link
                key={offer.id}
                href="/profile/inbound"
                className="flex items-center justify-between p-3.5 transition-colors hover:bg-slate-50"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {offer.senderAvatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={offer.senderAvatarUrl}
                      alt={offer.senderName}
                      className="h-7 w-7 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600 uppercase">
                      {offer.senderName.charAt(0)}
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="truncate font-semibold text-slate-900">
                        {offer.senderName}
                      </span>
                      <span className="text-slate-400">for</span>
                      <span className="truncate font-medium text-slate-700">
                        {offer.appEmoji} {offer.appName}
                      </span>
                    </div>
                    <p className="truncate text-xs text-slate-500">{offer.message}</p>
                  </div>
                </div>

                <div className="ml-3 flex shrink-0 items-center gap-2">
                  {offer.status === 'pending' && (
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                      Pending
                    </span>
                  )}
                  {offer.status === 'accepted' && (
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                      Accepted
                    </span>
                  )}
                  {offer.status === 'declined' && (
                    <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                      Declined
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* 3. Brief Outbound Offers Preview */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-slate-900">Recent Outbound Offers</h2>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
              {metrics.outboundCount}
            </span>
          </div>

          {metrics.outboundCount > 0 && (
            <Link
              href="/profile/outbound"
              className="text-xs font-medium text-brand-600 hover:text-brand-700"
            >
              View all ({metrics.outboundCount}) &rarr;
            </Link>
          )}
        </div>

        {outboundOffers.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white p-4 text-center">
            <p className="text-xs text-slate-500">You haven&apos;t offered help on any apps yet.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white divide-y divide-slate-100">
            {outboundOffers.map((offer) => (
              <Link
                key={offer.id}
                href="/profile/outbound"
                className="flex items-center justify-between p-3.5 transition-colors hover:bg-slate-50"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="shrink-0 text-lg">{offer.appEmoji}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="truncate font-semibold text-slate-900">{offer.appName}</span>
                    </div>
                    <p className="truncate text-xs text-slate-500">{offer.message}</p>
                  </div>
                </div>

                <div className="ml-3 flex shrink-0 items-center gap-2">
                  {offer.status === 'pending' && (
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                      Pending
                    </span>
                  )}
                  {offer.status === 'accepted' && (
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                      Accepted 🎉
                    </span>
                  )}
                  {offer.status === 'declined' && (
                    <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                      Declined
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function OverviewLoading() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      {/* Profile Card Skeleton */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-slate-200 shrink-0" />
          <div className="space-y-2 py-1">
            <div className="flex items-center gap-2">
              <div className="h-5 w-36 rounded bg-slate-200" />
              <div className="h-4 w-14 rounded bg-slate-100" />
            </div>
            <div className="h-4 w-48 rounded bg-slate-100" />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 rounded-xl bg-slate-50 p-3">
              <div className="h-6 w-12 rounded bg-slate-200" />
              <div className="h-3 w-16 rounded bg-slate-100" />
            </div>
          ))}
        </div>
      </div>

      {/* Apps Section Skeleton */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between py-1">
          <div className="h-4 w-24 rounded bg-slate-200" />
          <div className="h-3 w-20 rounded bg-slate-100" />
        </div>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white divide-y divide-slate-100">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-3.5">
              <div className="flex items-center gap-2.5">
                <div className="h-6 w-6 rounded bg-slate-100" />
                <div className="space-y-1.5">
                  <div className="h-4 w-32 rounded bg-slate-200" />
                  <div className="h-3 w-48 rounded bg-slate-100" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-3 w-16 rounded bg-slate-100" />
                <div className="h-3 w-10 rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inbound Requests Skeleton */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between py-1">
          <div className="h-4 w-44 rounded bg-slate-200" />
          <div className="h-3 w-20 rounded bg-slate-100" />
        </div>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white divide-y divide-slate-100">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-3.5">
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-full bg-slate-100 shrink-0" />
                <div className="space-y-1.5">
                  <div className="h-3.5 w-40 rounded bg-slate-200" />
                  <div className="h-3 w-56 rounded bg-slate-100" />
                </div>
              </div>
              <div className="h-5 w-16 rounded-full bg-slate-100" />
            </div>
          ))}
        </div>
      </div>

      {/* Outbound Offers Skeleton */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between py-1">
          <div className="h-4 w-44 rounded bg-slate-200" />
          <div className="h-3 w-20 rounded bg-slate-100" />
        </div>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white divide-y divide-slate-100">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center justify-between p-3.5">
              <div className="flex items-center gap-2.5">
                <div className="h-6 w-6 rounded bg-slate-100" />
                <div className="space-y-1.5">
                  <div className="h-3.5 w-32 rounded bg-slate-200" />
                  <div className="h-3 w-52 rounded bg-slate-100" />
                </div>
              </div>
              <div className="h-5 w-24 rounded-full bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
