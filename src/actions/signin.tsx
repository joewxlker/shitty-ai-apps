'use server';

import { signin } from '@/lib/serverUtils';

export async function signinAction() {
  await signin();
}
