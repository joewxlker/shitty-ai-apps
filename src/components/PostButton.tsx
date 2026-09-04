'use client';

import { useRouter } from 'next/navigation';
import { usePostModal } from '@/context/PostModalContext';
import { PlusIcon } from './icons';
import { useSession } from '@/context/SessionContext';

export const PostButton = () => {
  const router = useRouter();
  const { openPostModal } = usePostModal();
  const session = useSession();

  const handlePost = () => {
    if (!session) {
      router.push('/auth');
      return;
    }
    openPostModal();
  };

  return (
    <button
      onClick={handlePost}
      className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
    >
      <PlusIcon className="h-4 w-4" />
      {session ? 'Post your app' : 'Sign in to post'}
    </button>
  );
};
