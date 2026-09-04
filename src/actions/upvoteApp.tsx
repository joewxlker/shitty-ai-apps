'use server';

import { getSession, upvoteApp } from '@/lib/repo';
import { revalidatePath, updateTag } from 'next/cache';
import { redirect } from 'next/navigation';

export async function upvoteAppAction(slug: string) {
  const session = await getSession();
  if (!session) {
    redirect('/auth');
  }

  const result = await upvoteApp(slug, 'up');

  if (result.changed) {
    updateTag(slug);
    updateTag('apps');
    revalidatePath('/', 'layout');
  }
}
