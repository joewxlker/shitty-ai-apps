import Image from 'next/image';
import type { Session } from '@/lib/types';

interface ProfileCardProps {
  user: Session['user'];
  stats: {
    appsCount: number;
    totalMrr: number;
    totalUpvotes: number;
  };
}

export function ProfileCard({ user, stats }: ProfileCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-center gap-4">
        {user.icon ? (
          <Image
            src={user.icon}
            alt={user.name}
            width={56}
            height={56}
            className="h-14 w-14 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-200 text-lg font-semibold uppercase text-slate-600">
            {user.name?.charAt(0) ?? '?'}
          </div>
        )}

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">{user.name}</h1>
            <span className="rounded-md bg-brand-50 px-2 py-0.5 text-xs font-medium capitalize text-brand-600">
              {user.role}
            </span>
          </div>
          <p className="mt-0.5 text-sm text-slate-500">{user.email}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4 text-center">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-lg font-bold text-slate-900">{stats.appsCount}</p>
          <p className="text-xs text-slate-500">Apps posted</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-lg font-bold text-slate-900">${stats.totalMrr}</p>
          <p className="text-xs text-slate-500">Total MRR</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-lg font-bold text-slate-900">{stats.totalUpvotes}</p>
          <p className="text-xs text-slate-500">Total Upvotes</p>
        </div>
      </div>
    </div>
  );
}
