import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { JSX } from 'react';
import { UUID_PATTERN } from '@/features/protected/academic/data/academic-data';
import { AssessmentPage } from '@/features/protected/classroom/components/assessment-page';
import { ModuleGuard } from '@/features/protected/dashboard/components/module-guard';

export const metadata: Metadata = { title: 'Evaluación' };

// Rendered per request: the ids come from the URL and the data from the signed-in person's institution
export const instant = false;

const Page = async ({ params }: PageProps<'/dashboard/classroom/[id]/assessments/[itemId]'>): Promise<JSX.Element> => {
  const { id, itemId } = await params;
  if (!UUID_PATTERN.test(id) || !UUID_PATTERN.test(itemId)) notFound();
  return (
    <ModuleGuard module="classroom">
      <AssessmentPage roomId={id} itemId={itemId} />
    </ModuleGuard>
  );
};

export default Page;
