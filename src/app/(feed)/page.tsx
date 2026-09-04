import { getFeedApps } from '@/lib/repo';
import { AppList } from '@/components/AppList';

export default async function LatestFeedPage() {
  return <AppList items={await getFeedApps('latest')} />;
}
