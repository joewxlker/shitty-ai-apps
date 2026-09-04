import { Header } from '@/components/Header';
import { ReactNode } from 'react';

export default function CanHelpLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-w-0 flex-1 flex-col gap-5 overflow-y-scroll [scrollbar-gutter:stable] pr-1">
      <div className="shrink-0">
        <Header title="Can Help" subtitle="Browse by what you're good at and offer a hand." />
      </div>
      <div className="min-w-0 flex-1">{children}</div>
    </main>
  );
}
