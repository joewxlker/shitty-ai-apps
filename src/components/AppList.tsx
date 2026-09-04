'use client';

import { useFeed } from '@/context/FeedContext';
import { AppWithCommentCount } from '@/lib/types';
import { AppCard } from './AppCard';

type AppListProps = {
  items: AppWithCommentCount[];
};

export function AppList({ items }: AppListProps) {
  const { query } = useFeed();

  const filtered = query.trim()
    ? items.filter((app) => {
        const q = query.trim().toLowerCase();
        return (
          app.name.toLowerCase().includes(q) ||
          app.tagline.toLowerCase().includes(q) ||
          app.category.toLowerCase().includes(q) ||
          app.builtWith.toLowerCase().includes(q) ||
          app.techStack.some((tech) => tech.toLowerCase().includes(q))
        );
      })
    : items;

  if (filtered.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 p-10 text-center">
        <p className="text-sm font-medium text-slate-600">No apps here yet.</p>
        <p className="mt-1 text-sm text-slate-400">
          Try a different tab, clear your search, or be the first to post one.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {filtered.map((app) => (
        <AppCard key={app.id} app={app} />
      ))}
    </div>
  );
}
