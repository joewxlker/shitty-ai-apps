'use client';

import { Header } from '@/components/Header';
import { Tabs } from '@/components/Tabs';
import { SearchBox } from '@/components/SearchBox';
import { FeedProvider, useFeed } from '@/context/FeedContext';

function FeedHeaderAndControls() {
  const { query, setQuery } = useFeed();

  return (
    <div className="flex flex-col gap-5 shrink-0">
      <Header
        title="Share your shitty AI app."
        subtitle="No ideas. No pitch decks. It has to work."
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs />
        <SearchBox value={query} onChange={setQuery} />
      </div>
    </div>
  );
}

export default function FeedLayout({ children }: { children: React.ReactNode }) {
  return (
    <FeedProvider>
      <main className="flex min-w-0 flex-1 flex-col gap-5 overflow-y-scroll [scrollbar-gutter:stable] pr-1">
        <FeedHeaderAndControls />
        <div className="min-w-0 flex-1">{children}</div>
      </main>
    </FeedProvider>
  );
}
