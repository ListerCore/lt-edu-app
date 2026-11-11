import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { JSX } from 'react';
import { UUID_PATTERN } from '@/features/protected/academic/data/academic-data';
import { StudentDetailPage } from '@/features/protected/people/components/student-detail-page';

export const metadata: Metadata = { title: 'Estudiante' };

// Rendered per request: the id comes from the URL and the data from the signed-in person's institution
export const instant = false;

const Page = async ({ params, searchParams }: PageProps<'/dashboard/students/[id]'>): Promise<JSX.Element> => {
  const { id } = await params;
  if (!UUID_PATTERN.test(id)) notFound();
  const { tab } = await searchParams;
  return <StudentDetailPage id={id} initialTab={typeof tab === 'string' ? tab : undefined} />;
};

export default Page;
