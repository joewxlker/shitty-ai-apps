import { Header } from '@/components/Header';
import { Leaderboard } from '@/components/Leaderboard';
import { getLeaderboardApps } from '@/lib/repo';

export default async function LeaderboardPage() {
  const apps = await getLeaderboardApps();

  return (
    <main className="flex min-w-0 flex-1 flex-col gap-5 overflow-y-scroll [scrollbar-gutter:stable] pr-1">
      <div className="shrink-0">
        <Header title="Leaderboard" subtitle="Ranked by upvotes." />
      </div>
      <div className="min-w-0 flex-1">
        <Leaderboard apps={apps} />
      </div>
    </main>
  );
}
