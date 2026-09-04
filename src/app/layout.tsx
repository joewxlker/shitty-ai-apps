import type { Metadata } from 'next';
import './globals.css';

import { Sidebar } from '@/components/Sidebar';
import { MobileNav } from '@/components/MobileNav';
import { PostModalProvider } from '@/context/PostModalContext';
import { getSession } from '@/lib/serverUtils';
import { SessionProvider } from '@/context/SessionContext';

export const metadata: Metadata = {
  title: 'shitty ai apps',
  description: 'Share your shitty AI app. No ideas. No pitch decks. It has to work.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>
          <PostModalProvider>
            <div className="flex h-screen w-full overflow-hidden bg-[#f7f7fb]">
              <Sidebar />

              <div className="flex min-w-0 flex-1 gap-6 overflow-hidden p-4 pb-20 lg:p-8 lg:pb-8">
                {children}
              </div>

              <MobileNav />
            </div>
          </PostModalProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
