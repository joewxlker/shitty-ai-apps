import { getFeedApps } from '@/lib/repo';
import { AppList } from '@/components/AppList';

export default async function PopularFeedPage() {
  return <AppList items={await getFeedApps('popular')} />;
}
