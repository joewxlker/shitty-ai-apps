'use client';

import React, { createContext, useContext, useState } from 'react';

interface FeedContextType {
  query: string;
  setQuery: (q: string) => void;
}

const FeedContext = createContext<FeedContextType>({
  query: '',
  setQuery: () => {},
});

export function FeedProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState('');

  return <FeedContext.Provider value={{ query, setQuery }}>{children}</FeedContext.Provider>;
}

export function useFeed() {
  return useContext(FeedContext);
}
