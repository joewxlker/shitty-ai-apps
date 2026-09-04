'use server';

import { addComment } from '@/lib/repo';
import { revalidatePath, updateTag } from 'next/cache';
import z from 'zod';

export const addCommentAction = async (slug: string, formData: FormData) => {
  const parsed = z
    .object({
      comment: z.string().trim().min(1).max(500, 'Comment must be 500 characters or fewer.'),
    })
    .safeParse({
      comment: formData.get('comment'),
    });

  if (!parsed.success) {
    return;
  }

  await addComment(slug, parsed.data.comment);

  updateTag(slug);
  updateTag('apps');
  revalidatePath('/', 'layout');
};
