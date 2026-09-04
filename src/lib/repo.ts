import 'server-only';

import { APPS, COMMENTS, SESSION } from './db';
import { filterApps } from './serverUtils';
import { AiApp, AppWithCommentCount, Comment, Session, Tab } from './types';

export function getCommentCount(slug: string): number {
  return COMMENTS[slug]?.length ?? 0;
}

import { unstable_cache } from 'next/cache';

export const getFeedApps = unstable_cache(
  async (tab: Tab = 'latest', q: string | null = null): Promise<AppWithCommentCount[]> => {
    const filtered = filterApps(APPS, tab, q);

    return filtered.map((app) => ({
      ...app,
      upvoters: app.upvoters ?? [],
      commentCount: getCommentCount(app.slug),
    }));
  },
  ['feed-apps'],
  { tags: ['apps'] }
);

export const getLeaderboardApps = unstable_cache(
  async (): Promise<AiApp[]> => {
    return [...APPS].sort((a, b) => b.mrr - a.mrr);
  },
  ['leaderboard-apps'],
  { tags: ['apps'] }
);

export const getCanHelpApps = unstable_cache(
  async (): Promise<AppWithCommentCount[]> => {
    return APPS.filter((app) => app.needsHelpWith).map((app) => ({
      ...app,
      upvoters: app.upvoters ?? [],
      commentCount: getCommentCount(app.slug),
    }));
  },
  ['can-help-apps'],
  { tags: ['apps'] }
);

export async function getAppBySlug(
  slug: string
): Promise<{ app: AppWithCommentCount; comments: Comment[] } | null> {
  return unstable_cache(
    async () => {
      const decodedSlug = decodeURIComponent(slug);
      const app = APPS.find((app) => app.slug === slug || app.slug === decodedSlug);

      if (!app) {
        return null;
      }

      return {
        app: {
          ...app,
          upvoters: app.upvoters ?? [],
          commentCount: getCommentCount(app.slug),
        },
        comments: COMMENTS[app.slug] ?? [],
      };
    },
    ['app-by-slug', slug],
    { tags: ['apps', slug] }
  )();
}

export async function getComments(slug: string): Promise<{ comments: Comment[] }> {
  const app = APPS.find((app) => app.slug === slug);

  if (!app) {
    throw new Error('App not found.');
  }

  return {
    comments: COMMENTS[slug] ?? [],
  };
}

export async function getSession(): Promise<Session | null> {
  return SESSION;
}

async function requireSession(): Promise<Session> {
  const session = await getSession();

  if (!session) {
    throw new Error('You must be signed in.');
  }

  return session;
}

export async function createApp(payload: Partial<AiApp>): Promise<{ app: AiApp }> {
  const session = await requireSession();

  const name = (payload.name || '').trim();
  const tagline = (payload.tagline || '').trim();

  if (!name || !tagline) {
    throw new Error('Name and tagline are required.');
  }

  let baseSlug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  if (!baseSlug || baseSlug.length < 2) {
    baseSlug = `app-${crypto.randomUUID().slice(0, 8)}`;
  }

  let slug = baseSlug;
  let counter = 1;
  while (APPS.some((app) => app.slug === slug)) {
    slug = `${baseSlug}-${counter++}`;
  }

  const newApp: AiApp = {
    id: crypto.randomUUID(),
    slug,
    name,
    emoji: payload.emoji || '🤖',
    tagline,
    about: payload.about || tagline,
    story: payload.story || '',
    coverImageUrl: `https://shitty-ai-apps-assets.s3.amazonaws.com/covers/${slug}.png`,
    coverTheme: payload.coverTheme || 'dark',
    coverHeadline: payload.coverHeadline || name,
    builtWith: payload.builtWith || 'Built with AI',
    techStack: Array.isArray(payload.techStack) ? payload.techStack : [],
    websiteUrl: payload.websiteUrl || '',
    users: 0,
    mrr: 0,
    category: payload.category || 'SaaS',
    upvotes: 0,
    upvoters: [],
    contributors: [
      {
        id: session.user.id,
        name: session.user.name,
        avatarUrl: session.user.icon,
      },
    ],
    needsHelpWith: payload.needsHelpWith || null,
    contactEmail: payload.contactEmail ? payload.contactEmail.trim() : (session.user.email || undefined),
    launchedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    helpCategories: [],
  };

  APPS.unshift(newApp);

  return { app: newApp };
}

export async function upvoteApp(
  slug: string,
  direction: 'up' | 'down' = 'up'
): Promise<{ upvotes: number; changed: boolean }> {
  const session = await requireSession();

  const decodedSlug = decodeURIComponent(slug);
  const app = APPS.find((app) => app.slug === slug || app.slug === decodedSlug);

  if (!app) {
    throw new Error('App not found.');
  }

  if (!app.upvoters) {
    app.upvoters = [];
  }

  const userId = session.user.id;
  const hasUpvoted = app.upvoters.includes(userId);

  if (direction === 'up') {
    if (hasUpvoted) {
      return { upvotes: app.upvotes, changed: false };
    }
    app.upvoters.push(userId);
    app.upvotes = app.upvotes + 1;
    return { upvotes: app.upvotes, changed: true };
  } else {
    if (!hasUpvoted) {
      return { upvotes: app.upvotes, changed: false };
    }
    app.upvoters = app.upvoters.filter((id) => id !== userId);
    app.upvotes = Math.max(0, app.upvotes - 1);
    return { upvotes: app.upvotes, changed: true };
  }
}

export async function requestHelp(
  slug: string,
  needsHelpWith: string | null
): Promise<{ app: AiApp }> {
  const session = await requireSession();

  const app = APPS.find((app) => app.slug === slug);

  if (!app) {
    throw new Error('App not found.');
  }

  const isContributor = app.contributors.some((contributor) => contributor.id === session.user.id);

  if (!isContributor) {
    throw new Error('You can only update your own apps.');
  }

  app.needsHelpWith = needsHelpWith ? needsHelpWith.trim() : null;

  return { app };
}

export async function addComment(slug: string, body: string): Promise<{ comment: Comment }> {
  const session = await requireSession();

  const app = APPS.find((app) => app.slug === slug);

  if (!app) {
    throw new Error('App not found.');
  }

  if (!body.trim()) {
    throw new Error('Comment body is required.');
  }

  const comment = {
    id: crypto.randomUUID(),
    author: session.user.name,
    body: body.trim(),
    createdAt: new Date().toISOString(),
    avatarUrl: session.user.icon,
  } as Comment;

  if (!COMMENTS[slug]) {
    COMMENTS[slug] = [];
  }

  COMMENTS[slug].push(comment);

  return { comment };
}

export async function updateApp(
  slug: string,
  payload: Partial<AiApp>
): Promise<{ app: AiApp }> {
  const session = await requireSession();

  const app = APPS.find((app) => app.slug === slug);

  if (!app) {
    throw new Error('App not found.');
  }

  const isContributor = app.contributors.some((contributor) => contributor.id === session.user.id);

  if (!isContributor) {
    throw new Error('You can only update your own apps.');
  }

  if (payload.name) app.name = payload.name.trim();
  if (payload.tagline) app.tagline = payload.tagline.trim();
  if (payload.about !== undefined) app.about = payload.about ? payload.about.trim() : '';
  if (payload.websiteUrl !== undefined) app.websiteUrl = payload.websiteUrl ? payload.websiteUrl.trim() : '';
  if (payload.coverHeadline !== undefined) app.coverHeadline = payload.coverHeadline ? payload.coverHeadline.trim() : '';
  if (payload.coverTheme) app.coverTheme = payload.coverTheme;
  if (payload.category) app.category = payload.category;
  if (payload.builtWith) app.builtWith = payload.builtWith.trim();
  if (payload.emoji) app.emoji = payload.emoji.trim();
  if (payload.needsHelpWith !== undefined) {
    app.needsHelpWith = payload.needsHelpWith ? payload.needsHelpWith.trim() : null;
  }
  if (payload.contactEmail !== undefined) {
    app.contactEmail = payload.contactEmail ? payload.contactEmail.trim() : undefined;
  }

  return { app };
}

export async function getUserApps(userId: string): Promise<AppWithCommentCount[]> {
  return APPS.filter((app) =>
    app.contributors.some((contributor) => contributor.id === userId)
  ).map((app) => ({
    ...app,
    upvoters: app.upvoters ?? [],
    commentCount: getCommentCount(app.slug),
  }));
}

export async function deleteApp(slug: string): Promise<void> {
  const session = await requireSession();

  const index = APPS.findIndex((app) => app.slug === slug);

  if (index === -1) {
    throw new Error('App not found.');
  }

  const app = APPS[index];
  const isContributor = app.contributors.some((c) => c.id === session.user.id);

  if (!isContributor) {
    throw new Error('You can only delete your own apps.');
  }

  APPS.splice(index, 1);
}
