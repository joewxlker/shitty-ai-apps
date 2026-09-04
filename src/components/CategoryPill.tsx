import { Category } from '@/lib/types';

export function CategoryPill({ category }: { category: Category }) {
  return (
    <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-medium text-brand-700">
      {category}
    </span>
  );
}
