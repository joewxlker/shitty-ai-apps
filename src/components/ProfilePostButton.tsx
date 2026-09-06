'use client';

import { usePostModal } from '@/context/PostModalContext';
import { PlusIcon } from './icons';

export function ProfilePostButton({ variant = 'link' }: { variant?: 'link' | 'button' }) {
  const { openPostModal } = usePostModal();

  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={openPostModal}
        className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
      >
        <PlusIcon className="h-4 w-4" />
        Post your first app
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={openPostModal}
      className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
    >
      <PlusIcon className="h-3.5 w-3.5" />
      Post an app
    </button>
  );
}
