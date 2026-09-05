'use server';

import { submitHelpOffer } from '@/lib/repo';
import { revalidatePath, updateTag } from 'next/cache';
import z from 'zod';

export const submitHelpOfferAction = async (slug: string, formData: FormData) => {
  const schema = z.object({
    message: z
      .string()
      .trim()
      .min(1, 'Message is required.')
      .max(500, 'Message must be 500 characters or fewer.'),
    contact: z
      .string()
      .trim()
      .min(1, 'Contact info is required.')
      .max(100, 'Contact info must be 100 characters or fewer.'),
  });

  const parsed = schema.safeParse({
    message: formData.get('message'),
    contact: formData.get('contact'),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Invalid input.' };
  }

  try {
    await submitHelpOffer(slug, parsed.data.message, parsed.data.contact);
    updateTag(slug);
    updateTag('apps');
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : 'Failed to submit help offer.' };
  }
};
