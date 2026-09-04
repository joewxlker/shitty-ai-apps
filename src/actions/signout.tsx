'use server';

import { signout } from '@/lib/serverUtils';

export async function signoutAction() {
  await signout();
}
