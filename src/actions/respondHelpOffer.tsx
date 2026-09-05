'use server';

import { respondToHelpOffer } from '@/lib/repo';
import { revalidatePath, updateTag } from 'next/cache';

export const respondHelpOfferAction = async (
  slug: string,
  offerId: string,
  status: 'accepted' | 'declined'
) => {
  try {
    await respondToHelpOffer(offerId, status);
    updateTag(slug);
    updateTag('apps');
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : 'Failed to update help offer.' };
  }
};
