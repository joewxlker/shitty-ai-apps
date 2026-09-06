import { redirect } from 'next/navigation';
import { getSession, getUserInboundHelpOffers } from '@/lib/repo';
import { ProfileInboundManager } from '@/components/profile/ProfileInboundManager';

export default async function ProfileInboundPage() {
  const session = await getSession();

  if (!session) {
    redirect('/auth');
  }

  const inboundOffers = await getUserInboundHelpOffers(session.user.id);

  return <ProfileInboundManager offers={inboundOffers} />;
}
