'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface ProfileTabsProps {
  appsCount: number;
  inboundCount: number;
  outboundCount: number;
  pendingInboundCount?: number;
}

export function ProfileTabs({
  appsCount,
  inboundCount,
  outboundCount,
  pendingInboundCount = 0,
}: ProfileTabsProps) {
  const pathname = usePathname();

  const tabs = [
    { label: 'Overview', href: '/profile', exact: true },
    { label: `Apps (${appsCount})`, href: '/profile/apps' },
    {
      label: `Inbound (${inboundCount})`,
      href: '/profile/inbound',
      attentionCount: pendingInboundCount,
    },
    { label: `Outbound (${outboundCount})`, href: '/profile/outbound' },
  ];

  return (
    <div className="flex gap-1 rounded-lg bg-slate-100 p-1 text-sm">
      {tabs.map((tab) => {
        const isCurrent = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);
        const hasAttention = Boolean(tab.attentionCount && tab.attentionCount > 0);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={[
              'flex-1 text-center whitespace-nowrap rounded-md px-3 py-1.5 font-medium text-xs sm:text-sm transition-colors',
              isCurrent
                ? 'bg-white text-slate-900 shadow-card'
                : 'text-slate-500 hover:text-slate-700',
            ].join(' ')}
          >
            <span className="inline-flex items-center justify-center gap-1.5">
              <span>{tab.label}</span>
              {hasAttention && (
                <span
                  className="relative flex h-2 w-2 shrink-0"
                  title={`${tab.attentionCount} pending ${tab.attentionCount === 1 ? 'request requires' : 'requests require'} review`}
                  aria-label={`${tab.attentionCount} pending requests`}
                >
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
                </span>
              )}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
