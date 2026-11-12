import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { JSX } from 'react';
import { UUID_PATTERN } from '@/features/protected/academic/data/academic-data';
import { ApafaMeetingDetailPage } from '@/features/protected/apafa/components/apafa-meeting-detail-page';
import { ModuleGuard } from '@/features/protected/dashboard/components/module-guard';

export const metadata: Metadata = { title: 'Reunión APAFA' };

// Rendered per request: the id comes from the URL and the data from the signed-in person's institution
export const instant = false;

const Page = async ({ params }: PageProps<'/dashboard/apafa/[id]'>): Promise<JSX.Element> => {
  const { id } = await params;
  if (!UUID_PATTERN.test(id)) notFound();
  return (
    <ModuleGuard module="apafa">
      <ApafaMeetingDetailPage id={id} />
    </ModuleGuard>
  );
};

export default Page;
