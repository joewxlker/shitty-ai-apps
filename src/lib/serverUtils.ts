import 'server-only';

import { AiApp, Session, Tab } from './types';
import * as repo from './repo';
import { cookies } from 'next/headers';

export async function signin(): Promise<void> {
  const session = await repo.getSession();

  (await cookies()).set('auth', JSON.stringify(session));
}

export async function signout(): Promise<void> {
  (await cookies()).delete('auth');
}

export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get('auth');

  if (!token?.value) {
    return null;
  }

  try {
    return JSON.parse(token.value) as Session;
  } catch {
    return null;
  }
}

/** Simulates real network latency so loading states are visible in the UI. */
export function delay(ms = 350) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function filterApps(apps: AiApp[], tab: Tab, q: string | null): AiApp[] {
  let result = [...apps];

  if (tab === 'popular') {
    result.sort((a, b) => b.upvotes - a.upvotes);
  } else if (tab === 'need-help') {
    result = result.filter((a) => a.needsHelpWith);
  } else if (tab === 'just-launched') {
    result.sort((a, b) => new Date(b.launchedAt).getTime() - new Date(a.launchedAt).getTime());
  } else {
    // latest: newest first by createdAt / launchedAt (most recently posted first)
    result.sort((a, b) => {
      const timeA = new Date(a.createdAt || a.launchedAt).getTime();
      const timeB = new Date(b.createdAt || b.launchedAt).getTime();
      return timeB - timeA;
    });
  }

  if (q && q.trim()) {
    const needle = q.trim().toLowerCase();
    result = result.filter(
      (a) =>
        a.name.toLowerCase().includes(needle) ||
        a.tagline.toLowerCase().includes(needle) ||
        a.category.toLowerCase().includes(needle)
    );
  }

  return result;
}
