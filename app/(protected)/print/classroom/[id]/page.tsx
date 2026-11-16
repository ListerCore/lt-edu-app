import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { JSX } from 'react';
import { UUID_PATTERN } from '@/features/protected/academic/data/academic-data';
import { UnitPrintPage } from '@/features/protected/classroom/components/unit-print-page';
import { ModuleGuard } from '@/features/protected/dashboard/components/module-guard';

export const metadata: Metadata = { title: 'Unidad para imprimir' };

// Outside the panel shell so the printout has no sidebar or header
export const instant = false;

const Page = async ({ params, searchParams }: PageProps<'/print/classroom/[id]'>): Promise<JSX.Element> => {
  const { id } = await params;
  const { unit } = await searchParams;
  if (!UUID_PATTERN.test(id) || typeof unit !== 'string' || !UUID_PATTERN.test(unit)) notFound();
  return (
    <ModuleGuard module="classroom">
      <UnitPrintPage roomId={id} unitId={unit} />
    </ModuleGuard>
  );
};

export default Page;
