'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChartIcon, HeartHandshakeIcon, HomeIcon, IconProps, TrashIcon } from './icons';

import React from 'react';

const FEED_NAV: {
  href: string;
  label: string;
  exact?: boolean;
}[] = [
  {
    href: '/',
    label: 'Latest',
    exact: true,
  },
  {
    href: '/popular',
    label: 'Popular',
  },
  {
    href: '/need-help',
    label: 'Need Help',
  },
  {
    href: '/new',
    label: 'Just Launched',
  },
];

const PRIMARY_NAV: {
  href: string;
  label: string;
  icon: (p: IconProps) => React.ReactNode;
}[] = [
  {
    href: '/can-help',
    label: 'Can Help',
    icon: HeartHandshakeIcon,
  },
  {
    href: '/leaderboard',
    label: 'Leaderboard',
    icon: BarChartIcon,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  const isFeedActive =
    pathname === '/' ||
    pathname.startsWith('/apps/') ||
    FEED_NAV.some((item) => item.href !== '/' && pathname.startsWith(item.href));

  return (
    <aside className="hidden w-60 shrink-0 flex-col gap-6 border-r border-slate-200 bg-white px-4 py-6 lg:flex">
      <Link href="/" className="flex items-center gap-2 px-2 transition-opacity hover:opacity-90">
        <TrashIcon className="h-6 w-6 text-slate-900" />

        <div className="leading-tight">
          <p className="text-sm font-bold text-brand-600">shitty</p>
          <p className="-mt-0.5 text-sm font-bold text-slate-900">ai apps</p>
        </div>
      </Link>

      <nav className="flex flex-col gap-1">
        {/* Feed parent */}
        <Link
          href="/"
          className={[
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-colors',
            isFeedActive ? 'text-slate-900' : 'text-slate-600 hover:bg-slate-100',
          ].join(' ')}
        >
          <HomeIcon className="h-5 w-5" />
          Feed
        </Link>

        {/* Feed children */}
        <div className="mb-2 ml-5 flex flex-col gap-0.5 border-l border-slate-200 pl-3">
          {FEED_NAV.map((item) => {
            const isActive = item.exact
              ? pathname === '/' || pathname.startsWith('/apps/')
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  'rounded-lg px-3 py-1.5 text-sm transition-colors',
                  isActive
                    ? 'bg-brand-100 font-medium text-brand-700'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700',
                ].join(' ')}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Primary destinations */}
        {PRIMARY_NAV.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive ? 'bg-brand-100 text-brand-700' : 'text-slate-600 hover:bg-slate-100',
              ].join(' ')}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-xl border border-slate-200 p-3">
        <p className="text-sm font-semibold text-slate-900">Built with AI?</p>

        <p className="mt-1 text-xs text-slate-500">
          Claude, Cursor, Replit, GPT, Gemini, etc. We don&apos;t care. If it works, post it.
        </p>

        <button
          type="button"
          className="mt-2 w-full rounded-lg border border-slate-200 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-300"
        >
          How it works
        </button>
      </div>
    </aside>
  );
}
