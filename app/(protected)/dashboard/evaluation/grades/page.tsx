import type { Metadata } from 'next';
import type { JSX } from 'react';
import { GradesPage } from '@/features/protected/assessment/components/grades-page';
import { ModuleGuard } from '@/features/protected/dashboard/components/module-guard';

export const metadata: Metadata = { title: 'Notas' };

const Page = (): JSX.Element => (
  <ModuleGuard module="grades">
    <GradesPage />
  </ModuleGuard>
);

export default Page;
