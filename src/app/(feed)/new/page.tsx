import { getFeedApps } from '@/lib/repo';
import { AppList } from '@/components/AppList';

export default async function JustLaunchedFeedPage() {
  return <AppList items={await getFeedApps('just-launched')} />;
}
