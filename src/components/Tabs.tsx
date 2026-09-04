'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Tab } from '@/lib/types';

const TAB_CONFIG: { id: Tab; label: string; href: string }[] = [
  { id: 'latest', label: 'Latest', href: '/' },
  { id: 'popular', label: 'Popular', href: '/popular' },
  { id: 'need-help', label: 'Need Help', href: '/need-help' },
  { id: 'just-launched', label: 'Just Launched', href: '/new' },
];

export function Tabs({
  active,
  onChange,
}: {
  active?: Tab;
  onChange?: (t: Tab) => void;
} = {}) {
  const pathname = usePathname();

  return (
    <div className="flex gap-1 overflow-x-auto rounded-lg bg-slate-100 p-1 text-sm">
      {TAB_CONFIG.map((t) => {
        const isCurrent = active ? active === t.id : pathname === t.href;

        if (onChange) {
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              className={[
                'whitespace-nowrap rounded-md px-3 py-1.5 font-medium transition-colors',
                isCurrent
                  ? 'bg-white text-slate-900 shadow-card'
                  : 'text-slate-500 hover:text-slate-700',
              ].join(' ')}
            >
              {t.label}
            </button>
          );
        }

        return (
          <Link
            key={t.id}
            href={t.href}
            className={[
              'whitespace-nowrap rounded-md px-3 py-1.5 font-medium transition-colors',
              isCurrent
                ? 'bg-white text-slate-900 shadow-card'
                : 'text-slate-500 hover:text-slate-700',
            ].join(' ')}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
