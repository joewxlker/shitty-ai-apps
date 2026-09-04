'use server';

import { redirect } from 'next/navigation';
import { updateTag } from 'next/cache';
import { z } from 'zod';

import { createApp } from '@/lib/repo';

const createAppSchema = z.object({
  name: z.string().trim().min(1, 'App name is required.'),
  emoji: z.string().trim().min(1, 'Emoji is required.'),
  tagline: z.string().trim().min(1, 'Tagline is required.'),
  coverHeadline: z.string().trim().optional(),
  about: z.string().trim().optional(),
  builtWith: z.string().trim().min(1, 'Built with is required.'),
  websiteUrl: z.url('Enter a valid website URL.').or(z.literal('')),
  category: z.enum(['SaaS', 'Lifestyle', 'Productivity', 'Dev Tools', 'Fun']),
  coverTheme: z.enum(['dark', 'light', 'mint', 'sunset']),
  needsHelpWith: z.string().trim().optional(),
  contactEmail: z.string().trim().email('Enter a valid contact email.').or(z.literal('')).optional(),
});

export type CreateAppState = {
  errors?: {
    [key: string]: { errors: string[] } | undefined;
  };
  message?: string;
};

export async function createAppAction(
  _previousState: CreateAppState,
  formData: FormData
): Promise<CreateAppState> {
  const result = createAppSchema.safeParse({
    name: formData.get('name'),
    emoji: formData.get('emoji'),
    tagline: formData.get('tagline'),
    coverHeadline: formData.get('coverHeadline'),
    about: formData.get('about'),
    builtWith: formData.get('builtWith'),
    websiteUrl: formData.get('websiteUrl'),
    category: formData.get('category'),
    coverTheme: formData.get('coverTheme'),
    needsHelpWith: formData.get('needsHelpWith'),
    contactEmail: formData.get('contactEmail'),
  });

  if (!result.success) {
    return {
      errors: z.treeifyError(result.error).properties,
    };
  }

  const data = result.data;

  let slug: string;

  try {
    const result = await createApp({
      ...data,
      coverHeadline: data.coverHeadline || data.name,
      needsHelpWith: data.needsHelpWith || null,
      contactEmail: data.contactEmail || undefined,
    });

    slug = result.app.slug;
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : 'Something went wrong.',
    };
  }

  updateTag('apps');
  redirect(`/apps/${slug}`);
}
