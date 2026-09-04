'use server';

import { deleteApp } from '@/lib/repo';
import { revalidatePath, updateTag } from 'next/cache';

export async function deleteAppAction(slug: string): Promise<void> {
  await deleteApp(slug);

  updateTag(slug);
  updateTag('apps');
  revalidatePath('/', 'layout');
}
