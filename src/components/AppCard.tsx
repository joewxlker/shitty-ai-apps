'use client';

import Link from 'next/link';

import { upvoteAppAction } from '@/actions/upvoteApp';
import { AppWithCommentCount } from '@/lib/types';
import { useSession } from '@/context/SessionContext';

import { AppCover } from './AppCover';
import { AvatarStack } from './AvatarStack';
import { CategoryPill } from './CategoryPill';
import { ArrowUpIcon, DollarIcon, ExternalLinkIcon, MessageCircleIcon, UsersIcon } from './icons';

interface AppCardProps {
  app: AppWithCommentCount;
  active?: boolean;
}

type HelpState = 'owner-idle' | 'owner-requesting-help' | 'visitor-can-help' | 'neutral';

export function AppCard({ app, active = false }: AppCardProps) {
  const session = useSession();

  const appHref = `/apps/${app.slug}`;
  const upvote = upvoteAppAction.bind(null, app.slug);

  const isContributor = Boolean(
    session?.user?.id && app.contributors.some((contributor) => contributor.id === session.user.id)
  );

  const hasUpvoted = Boolean(
    session?.user?.id && app.upvoters?.includes(session.user.id)
  );

  const hasHelpRequest = Boolean(app.needsHelpWith);

  const helpState: HelpState = isContributor
    ? hasHelpRequest
      ? 'owner-requesting-help'
      : 'owner-idle'
    : hasHelpRequest
      ? 'visitor-can-help'
      : 'neutral';

  return (
    <div
      className={[
        'flex gap-4 rounded-2xl border bg-white p-4 shadow-card transition-colors',
        active
          ? 'border-brand-500 ring-1 ring-brand-500'
          : hasHelpRequest
            ? 'border-brand-200 hover:border-brand-300'
            : 'border-slate-200 hover:border-brand-200',
      ].join(' ')}
    >
      <Link href={appHref} className="shrink-0" aria-label={`Open ${app.name}`}>
        <AppCover app={app} />
      </Link>

      <div className="min-w-0 flex-1">
        <Link href={appHref} className="group block text-left">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="flex items-center gap-1.5 text-base font-semibold text-slate-900 transition-colors group-hover:text-brand-600">
              <span>{app.emoji}</span>
              {app.name}
            </h3>

            <AppStateBadge state={helpState} />
          </div>

          <p className="mt-1 line-clamp-2 text-sm text-slate-600">{app.tagline}</p>
        </Link>

        <p className="mt-2 text-xs text-slate-400">{app.builtWith}</p>

        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <span className="inline-flex items-center gap-1">
            <UsersIcon className="h-4 w-4" />
            {app.users} users
          </span>

          <span className="inline-flex items-center gap-1">
            <DollarIcon className="h-4 w-4" />${app.mrr} MRR
          </span>

          <CategoryPill category={app.category} />
        </div>

        <div className="mt-3 flex items-center gap-4">
          <AvatarStack contributors={app.contributors} />

          <form action={upvote}>
            <button
              type="submit"
              disabled={hasUpvoted}
              title={hasUpvoted ? 'You already upvoted this app' : 'Upvote'}
              className={[
                'inline-flex items-center gap-1 text-sm font-medium transition-colors',
                hasUpvoted
                  ? 'cursor-default font-semibold text-brand-600'
                  : 'text-slate-500 hover:text-brand-600',
              ].join(' ')}
            >
              <ArrowUpIcon className={['h-4 w-4', hasUpvoted ? 'stroke-[2.5] text-brand-600' : ''].join(' ')} />
              {app.upvotes}
            </button>
          </form>

          <Link
            href={appHref}
            className="inline-flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-brand-600"
          >
            <MessageCircleIcon className="h-4 w-4" />
            {app.commentCount} comments
          </Link>
        </div>
      </div>

      <AppActions app={app} state={helpState} appHref={appHref} />
    </div>
  );
}

function AppStateBadge({ state }: { state: HelpState }) {
  switch (state) {
    case 'owner-idle':
      return (
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
          Your project
        </span>
      );

    case 'owner-requesting-help':
      return (
        <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[11px] font-semibold text-brand-800">
          Help request active
        </span>
      );

    case 'visitor-can-help':
      return (
        <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[11px] font-semibold text-brand-800">
          Needs help
        </span>
      );

    default:
      return null;
  }
}

function AppActions({
  app,
  state,
  appHref,
}: {
  app: AppWithCommentCount;
  state: HelpState;
  appHref: string;
}) {
  return (
    <div className="hidden w-52 shrink-0 lg:block">
      {state === 'owner-idle' && (
        <div className="flex h-full flex-col justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div>
            <p className="text-xs font-semibold text-slate-700">Your project</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Looking for feedback, users, or expertise?
            </p>
          </div>

          <div className="mt-3 space-y-2">
            <Link
              href={`${appHref}?needHelp=1`}
              className="block rounded-lg bg-brand-500 px-3 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-brand-600"
            >
              Ask for help
            </Link>

            {app.websiteUrl && <TryItButton url={app.websiteUrl} />}
          </div>
        </div>
      )}

      {state === 'owner-requesting-help' && (
        <div className="flex h-full flex-col justify-between rounded-xl border border-brand-300 bg-brand-50 p-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand-500" />
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-800">
                Help request active
              </p>
            </div>

            <p className="mt-2 text-sm font-medium leading-snug text-slate-800">
              {app.needsHelpWith}
            </p>
          </div>

          <div className="mt-3 space-y-2">
            <Link
              href={`${appHref}?needHelp=1`}
              className="block rounded-lg border border-brand-300 bg-white px-3 py-2 text-center text-sm font-semibold text-brand-800 transition-colors hover:bg-brand-100"
            >
              Manage request
            </Link>

            {app.websiteUrl && <TryItButton url={app.websiteUrl} />}
          </div>
        </div>
      )}

      {state === 'visitor-can-help' && (
        <div className="flex h-full flex-col justify-between rounded-xl border border-brand-200 bg-brand-50/70 p-3">
          <div>
            <p className="text-xs font-semibold tracking-wide text-brand-700">
              They need help with
            </p>

            <p className="mt-1.5 text-sm font-medium leading-snug text-slate-800">
              {app.needsHelpWith}
            </p>
          </div>

          <div className="mt-3 space-y-2">
            <Link
              href={`${appHref}?canHelp=1`}
              className="block rounded-lg bg-emerald-600 px-3 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              I can help
            </Link>

            {app.websiteUrl && <TryItButton url={app.websiteUrl} />}
          </div>
        </div>
      )}

      {state === 'neutral' && app.websiteUrl && (
        <div className="flex h-full items-start justify-end">
          <TryItButton url={app.websiteUrl} />
        </div>
      )}
    </div>
  );
}

function TryItButton({ url }: { url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
    >
      Try it
      <ExternalLinkIcon className="h-3.5 w-3.5" />
    </a>
  );
}
