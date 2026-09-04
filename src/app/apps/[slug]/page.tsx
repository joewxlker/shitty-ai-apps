import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { DetailPanel } from '@/components/DetailPanel';
import { getAppBySlug } from '@/lib/repo';

export default async function AppDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ needHelp?: string }>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const data = await getAppBySlug(slug);

  if (!data) {
    notFound();
  }

  return (
    <main className="flex min-w-0 flex-1 justify-center overflow-y-scroll [scrollbar-gutter:stable] p-1">
      <div className="w-full max-w-2xl">
        <Suspense fallback={null}>
          <DetailPanel
            app={data.app}
            comments={data.comments}
            initialShowHelpForm={resolvedSearchParams?.needHelp === '1'}
          />
        </Suspense>
      </div>
    </main>
  );
}
