import Image from 'next/image';
import { Contributor } from '@/lib/types';

export function AvatarStack({
  contributors,
  size = 24,
}: {
  contributors: Contributor[];
  size?: number;
}) {
  if (!contributors.length) return null;
  return (
    <div className="flex -space-x-2">
      {contributors.slice(0, 4).map((c) =>
        c.avatarUrl ? (
          <Image
            key={c.id}
            src={c.avatarUrl}
            alt={c.name}
            width={size}
            height={size}
            className="rounded-full ring-2 ring-white object-cover"
            title={c.name}
          />
        ) : (
          <div
            key={c.id}
            style={{ width: size, height: size }}
            className="flex items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold uppercase text-slate-600 ring-2 ring-white"
            title={c.name}
          >
            {c.name.charAt(0)}
          </div>
        )
      )}
    </div>
  );
}
