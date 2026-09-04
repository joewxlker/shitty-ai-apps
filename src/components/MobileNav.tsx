'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BarChartIcon,
  HeartHandshakeIcon,
  HomeIcon,
  IconProps,
  LightbulbIcon,
  PlusIcon,
} from './icons';
import { usePostModal } from '@/context/PostModalContext';
import { useSession } from '@/context/SessionContext';

import React from 'react';

const ITEMS: {
  href: string;
  label: string;
  icon: (p: IconProps) => React.ReactNode;
  exact?: boolean;
}[] = [
  { href: '/', label: 'Feed', icon: HomeIcon, exact: true },
  { href: '/need-help', label: 'Need Help', icon: LightbulbIcon },
];

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const session = useSession();
  const { openPostModal } = usePostModal();

  const handlePost = () => {
    if (!session) {
      router.push('/auth');
      return;
    }
    openPostModal();
  };

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-slate-200 bg-white px-2 py-2 lg:hidden">
      {ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = item.exact
          ? pathname === item.href || (item.href === '/' && pathname.startsWith('/apps/'))
          : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={[
              'flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[11px] font-medium',
              isActive ? 'text-brand-600' : 'text-slate-500',
            ].join(' ')}
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}

      <button
        onClick={handlePost}
        className="-mt-6 flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-white shadow-panel"
        aria-label="Post your app"
      >
        <PlusIcon className="h-5 w-5" />
      </button>

      <Link
        href="/leaderboard"
        className={[
          'flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[11px] font-medium',
          pathname === '/leaderboard' ? 'text-brand-600' : 'text-slate-500',
        ].join(' ')}
      >
        <BarChartIcon className="h-5 w-5" />
        Leaderboard
      </Link>
      <Link
        href="/can-help"
        className={[
          'flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[11px] font-medium',
          pathname === '/can-help' ? 'text-brand-600' : 'text-slate-500',
        ].join(' ')}
      >
        <HeartHandshakeIcon className="h-5 w-5" />
        Can Help
      </Link>
    </nav>
  );
}
