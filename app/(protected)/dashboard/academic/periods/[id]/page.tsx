import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { JSX } from 'react';
import { PeriodDetailPage } from '@/features/protected/academic/components/period-detail-page';
import { UUID_PATTERN } from '@/features/protected/academic/data/academic-data';

export const metadata: Metadata = { title: 'Periodo' };

// Rendered per request: the id comes from the URL and the data from the signed-in person's institution
export const instant = false;

const Page = async ({ params }: PageProps<'/dashboard/academic/periods/[id]'>): Promise<JSX.Element> => {
  const { id } = await params;
  if (!UUID_PATTERN.test(id)) notFound();
  return <PeriodDetailPage id={id} />;
};

export default Page;
