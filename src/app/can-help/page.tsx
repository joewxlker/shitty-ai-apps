import { CanHelp } from '@/components/CanHelp';
import { getCanHelpApps } from '@/lib/repo';

export default async function CanHelpPage() {
  const apps = await getCanHelpApps();

  await new Promise((r) => setTimeout(() => r(''), 1000));

  return <CanHelp apps={apps} />;
}
