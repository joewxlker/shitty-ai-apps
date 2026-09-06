import { redirect } from 'next/navigation';
import { getSession, getUserApps } from '@/lib/repo';
import { ProfileAppsManager } from '@/components/profile/ProfileAppsManager';

export default async function ProfileAppsPage() {
  const session = await getSession();

  if (!session) {
    redirect('/auth');
  }

  const apps = await getUserApps(session.user.id);

  return <ProfileAppsManager apps={apps} />;
}
