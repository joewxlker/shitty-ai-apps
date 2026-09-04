'use server';

import { requestHelp } from '@/lib/repo';
import { updateTag } from 'next/cache';
import z from 'zod';

export const requestHelpAction = async (slug: string, formData: FormData) => {
  const parsed = z
    .object({
      help: z.string().trim().min(1),
    })
    .safeParse({
      help: formData.get('help'),
    });

  if (!parsed.success) {
    return;
  }

  await requestHelp(slug, parsed.data.help);

  updateTag(slug);
  updateTag('apps');
};
