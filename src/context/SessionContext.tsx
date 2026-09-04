'use client';

import { Session } from '@/lib/types';
import { createContext, useContext } from 'react';

const SessionContext = createContext<Session | null>(null);

export function SessionProvider({
  session,
  children,
}: {
  session: Session | null;
  children: React.ReactNode;
}) {
  return <SessionContext value={session}>{children}</SessionContext>;
}

export function useSession() {
  return useContext(SessionContext);
}
