'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { AppWithCommentCount, HelpCategory } from '@/lib/types';
import { AppCover } from './AppCover';

export function CanHelp({ apps }: { apps: AppWithCommentCount[] }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const map = new Map<string, HelpCategory>();
    apps.forEach((a) => a.helpCategories.forEach((h) => map.set(h.label, h)));
    return Array.from(map.values());
  }, [apps]);

  const visibleApps = activeCategory
    ? apps.filter((a) => a.helpCategories.some((h) => h.label === activeCategory))
    : apps;

  return (
    <div className="flex flex-col gap-6">
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className={[
              'rounded-full border px-3 py-1.5 text-sm font-medium',
              activeCategory === null
                ? 'border-brand-500 bg-brand-50 text-brand-700'
                : 'border-slate-200 text-slate-600 hover:border-slate-300',
            ].join(' ')}
          >
            All ({apps.length})
          </button>
          {categories.map((c) => (
            <button
              key={c.label}
              type="button"
              onClick={() => setActiveCategory(c.label)}
              className={[
                'rounded-full border px-3 py-1.5 text-sm font-medium',
                activeCategory === c.label
                  ? 'border-brand-500 bg-brand-50 text-brand-700'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300',
              ].join(' ')}
            >
              {c.label} · {c.peopleCount}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {visibleApps.map((app) => {
          const cardContent = (
            <>
              <AppCover app={app} />
              <div>
                <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
                  <span>{app.emoji}</span>
                  {app.name}
                </p>
                <p className="mt-1 line-clamp-2 text-xs text-slate-500">{app.tagline}</p>
              </div>
              {app.needsHelpWith && (
                <div
                  className="line-clamp-2 break-words rounded-lg bg-brand-50 px-2.5 py-1.5 text-xs font-medium text-brand-700"
                  title={app.needsHelpWith}
                >
                  Needs help with: {app.needsHelpWith}
                </div>
              )}
            </>
          );

          return (
            <Link
              key={app.id}
              href={`/apps/${app.slug}`}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-card hover:border-brand-200 transition-colors"
            >
              {cardContent}
            </Link>
          );
        })}
        {visibleApps.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-slate-400">
            No one needs help with that right now.
          </p>
        )}
      </div>
    </div>
  );
}
