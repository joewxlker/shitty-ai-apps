'use server';

import { updateApp } from '@/lib/repo';
import { revalidatePath, updateTag } from 'next/cache';
import { z } from 'zod';

const emptyOrUrl = z
  .string()
  .trim()
  .max(200, 'Website URL must be 200 characters or fewer.')
  .refine((val) => !val || z.string().url().safeParse(val).success, {
    message: 'Enter a valid website URL.',
  })
  .optional();

const emptyOrEmail = z
  .string()
  .trim()
  .max(100, 'Contact email must be 100 characters or fewer.')
  .refine((val) => !val || z.string().email().safeParse(val).success, {
    message: 'Enter a valid contact email.',
  })
  .optional();

const updateAppSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'App name is required.')
    .max(60, 'App name must be 60 characters or fewer.'),
  emoji: z.string().trim().min(1, 'Emoji is required.'),
  tagline: z
    .string()
    .trim()
    .min(1, 'Tagline is required.')
    .max(140, 'Tagline must be 140 characters or fewer.'),
  coverHeadline: z
    .string()
    .trim()
    .max(80, 'Cover headline must be 80 characters or fewer.')
    .optional(),
  about: z.string().trim().max(1000, 'About must be 1000 characters or fewer.').optional(),
  builtWith: z
    .string()
    .trim()
    .min(1, 'Built with is required.')
    .max(100, 'Built with must be 100 characters or fewer.'),
  websiteUrl: emptyOrUrl,
  category: z.enum(['SaaS', 'Lifestyle', 'Productivity', 'Dev Tools', 'Fun']),
  coverTheme: z.enum(['dark', 'light', 'mint', 'sunset']),
  needsHelpWith: z
    .string()
    .trim()
    .max(200, 'Help request must be 200 characters or fewer.')
    .optional(),
  contactEmail: emptyOrEmail,
});

export type UpdateAppState = {
  errors?: {
    [key: string]: { errors: string[] } | undefined;
  };
  message?: string;
  success?: boolean;
};

export async function updateAppAction(
  slug: string,
  _previousState: UpdateAppState,
  formData: FormData
): Promise<UpdateAppState> {
  const result = updateAppSchema.safeParse({
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

  try {
    await updateApp(slug, {
      ...data,
      coverHeadline: data.coverHeadline ? data.coverHeadline.trim() : '',
      about: data.about ? data.about.trim() : '',
      websiteUrl: data.websiteUrl ? data.websiteUrl.trim() : '',
      needsHelpWith: data.needsHelpWith ? data.needsHelpWith.trim() : null,
      contactEmail: data.contactEmail ? data.contactEmail.trim() : '',
    });

    updateTag(slug);
    updateTag('apps');
    revalidatePath('/', 'layout');

    return { success: true };
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : 'Something went wrong.',
    };
  }
}
