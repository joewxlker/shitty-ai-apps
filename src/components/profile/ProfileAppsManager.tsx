'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';
import { deleteAppAction } from '@/actions/deleteApp';
import type { AppWithCommentCount, Category } from '@/lib/types';
import { CategoryPill } from '@/components/CategoryPill';
import { ProfilePostButton } from '@/components/ProfilePostButton';
import {
  DollarIcon,
  ExternalLinkIcon,
  MessageCircleIcon,
  PencilIcon,
  SearchIcon,
  TrashIcon,
  UsersIcon,
  XIcon,
} from '@/components/icons';

const CATEGORIES: ('All' | Category)[] = [
  'All',
  'Dev Tools',
  'Productivity',
  'SaaS',
  'Lifestyle',
  'Fun',
];

interface ProfileAppsManagerProps {
  apps: AppWithCommentCount[];
}

export function ProfileAppsManager({ apps }: ProfileAppsManagerProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'All' | Category>('All');
  const [needsHelpOnly, setNeedsHelpOnly] = useState(false);

  // Deletion state
  const [confirmDeleteSlug, setConfirmDeleteSlug] = useState<string | null>(null);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      if (category !== 'All' && app.category !== category) return false;
      if (needsHelpOnly && !app.needsHelpWith) return false;
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchName = app.name.toLowerCase().includes(q);
        const matchTagline = app.tagline.toLowerCase().includes(q);
        const matchTech = app.techStack?.some((t) => t.toLowerCase().includes(q));
        if (!matchName && !matchTagline && !matchTech) return false;
      }
      return true;
    });
  }, [apps, category, needsHelpOnly, search]);

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
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">Your apps ({apps.length})</h2>
        <ProfilePostButton variant="link" />
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your apps..."
              className="w-full rounded-lg border border-slate-200 py-1.5 pl-9 pr-8 text-xs outline-none focus:border-brand-500"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <XIcon className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-brand-500"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All categories' : cat}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setNeedsHelpOnly(!needsHelpOnly)}
            className={[
              'rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap',
              needsHelpOnly
                ? 'border-amber-400 bg-amber-50 text-amber-800'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50',
            ].join(' ')}
          >
            ⚡ Needs help
          </button>
        </div>
      </div>

      {/* App Cards List */}
      {filteredApps.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
          <span className="text-2xl">🔍</span>
          <h3 className="mt-2 text-sm font-semibold text-slate-900">No apps found</h3>
          <p className="mt-1 max-w-sm text-xs text-slate-500">
            {apps.length === 0
              ? 'You have not posted any apps yet.'
              : 'No apps match your search or filter criteria.'}
          </p>
          {apps.length > 0 ? (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setCategory('All');
                setNeedsHelpOnly(false);
              }}
              className="mt-3 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Clear filters
            </button>
          ) : (
            <ProfilePostButton variant="button" />
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredApps.map((app) => {
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
                    {app.users.toLocaleString()} users
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                    <DollarIcon className="h-3.5 w-3.5 text-emerald-600" />$
                    {app.mrr.toLocaleString()} MRR
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
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <TrashIcon className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
