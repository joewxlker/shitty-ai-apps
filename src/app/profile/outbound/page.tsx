import { redirect } from 'next/navigation';
import { getSession, getUserOutboundHelpOffers } from '@/lib/repo';
import { ProfileOutboundManager } from '@/components/profile/ProfileOutboundManager';

export default async function ProfileOutboundPage() {
  const session = await getSession();

  if (!session) {
    redirect('/auth');
  }

  const outboundOffers = await getUserOutboundHelpOffers(session.user.id);

  return <ProfileOutboundManager offers={outboundOffers} />;
}
