'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { deleteAppAction } from '@/actions/deleteApp';
import type { AppWithCommentCount } from '@/lib/types';
import { CategoryPill } from './CategoryPill';
import {
  DollarIcon,
  ExternalLinkIcon,
  MessageCircleIcon,
  PencilIcon,
  TrashIcon,
  UsersIcon,
} from './icons';

export function ProfileAppList({ apps }: { apps: AppWithCommentCount[] }) {
  const router = useRouter();
  const [confirmDeleteSlug, setConfirmDeleteSlug] = useState<string | null>(null);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = (slug: string) => {
    setDeletingSlug(slug);
    startTransition(async () => {
      try {
        await deleteAppAction(slug);
        setConfirmDeleteSlug(null);
        router.refresh();
      } finally {
        setDeletingSlug(null);
      }
    });
  };

  return (
    <div className="flex flex-col gap-3">
      {apps.map((app) => {
        const isConfirming = confirmDeleteSlug === app.slug;
        const isDeleting = deletingSlug === app.slug && isPending;

        return (
          <div
            key={app.id}
            className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-slate-300"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{app.emoji}</span>
                  <Link
                    href={`/apps/${app.slug}`}
                    className="truncate font-bold text-slate-900 transition-colors hover:text-brand-600"
                  >
                    {app.name}
                  </Link>
                  <CategoryPill category={app.category} />
                  {app.needsHelpWith && (
                    <span className="rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                      Needs help
                    </span>
                  )}
                </div>
                <p className="mt-1 line-clamp-1 text-sm text-slate-600">{app.tagline}</p>
              </div>

              {app.websiteUrl && (
                <a
                  href={app.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Visit website"
                >
                  <ExternalLinkIcon className="h-4 w-4" />
                </a>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <UsersIcon className="h-3.5 w-3.5" />
                {app.users} users
              </span>
              <span className="inline-flex items-center gap-1">
                <DollarIcon className="h-3.5 w-3.5" />${app.mrr} MRR
              </span>
              <span>▲ {app.upvotes} upvotes</span>
              <span className="inline-flex items-center gap-1">
                <MessageCircleIcon className="h-3.5 w-3.5" />
                {app.commentCount} comments
              </span>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <div className="flex items-center gap-2">
                <Link
                  href={`/apps/${app.slug}`}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  View
                </Link>
                <Link
                  href={`/apps/${app.slug}?edit=1`}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  <PencilIcon className="h-3 w-3" />
                  Edit
                </Link>
              </div>

              <div>
                {isConfirming ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-red-600 font-medium">Are you sure?</span>
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={() => handleDelete(app.slug)}
                      className="rounded-lg bg-red-600 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                    >
                      {isDeleting ? 'Deleting…' : 'Yes, delete'}
                    </button>
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={() => setConfirmDeleteSlug(null)}
                      className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteSlug(app.slug)}
                    className="inline-flex items-center gap-1 rounded-lg p-1.5 text-xs font-medium text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    aria-label={`Delete ${app.name}`}
                  >
                    <TrashIcon className="h-4 w-4" />
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
