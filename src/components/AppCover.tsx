'use client';

import { AiApp } from '@/lib/types';
import { coverThemeClasses } from '@/lib/coverTheme';

// TODO: Fetch OpenGraph preview image server-side or enable S3/storage image uploads
export function AppCover({
  app,
  size = 'sm',
}: {
  app: Pick<AiApp, 'websiteUrl' | 'coverTheme' | 'coverHeadline' | 'emoji'>;
  size?: 'sm' | 'lg';
}) {
  const theme = coverThemeClasses[app.coverTheme];

  return (
    <div
      className={[
        theme.bg,
        'relative flex shrink-0 flex-col justify-between overflow-hidden rounded-xl',
        size === 'sm' ? 'h-[104px] w-[140px] p-3' : 'h-[180px] w-full p-5',
      ].join(' ')}
    >
      <div className="flex gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-20" />
        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-20" />
        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-20" />
      </div>

      <p
        className={[
          theme.text,
          'font-semibold leading-snug',
          size === 'sm' ? 'text-[13px]' : 'text-xl',
        ].join(' ')}
      >
        {app.coverHeadline}
      </p>

      <span
        className={[
          'absolute opacity-20',
          size === 'sm' ? '-right-2 -bottom-3 text-4xl' : '-right-3 -bottom-6 text-7xl',
        ].join(' ')}
        aria-hidden
      >
        {app.emoji}
      </span>
    </div>
  );
}
