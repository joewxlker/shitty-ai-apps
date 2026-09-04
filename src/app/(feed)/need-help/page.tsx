import { getFeedApps } from '@/lib/repo';
import { AppList } from '@/components/AppList';

export default async function NeedHelpFeedPage() {
  return <AppList items={await getFeedApps('need-help')} />;
}
