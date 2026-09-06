import Link from 'next/link';
import { AiApp } from '@/lib/types';

export function Leaderboard({ apps }: { apps: AiApp[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {apps.map((app, i) => {
        const content = (
          <>
            <span className="w-6 text-center text-sm font-bold text-slate-400">{i + 1}</span>
            <span className="text-xl">{app.emoji}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900">{app.name}</p>
              <p className="truncate text-xs text-slate-500">{app.tagline}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-sm font-semibold text-slate-900">{app.upvotes} upvotes</p>
              <p className="text-xs text-slate-400">{app.users.toLocaleString()} users</p>
            </div>
          </>
        );

        return (
          <Link
            key={app.id}
            href={`/apps/${app.slug}`}
            className="flex w-full items-center gap-4 border-b border-slate-100 p-4 text-left last:border-none hover:bg-slate-50 transition-colors"
          >
            {content}
          </Link>
        );
      })}
    </div>
  );
}
