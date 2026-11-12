import type { Metadata } from 'next';
import type { JSX } from 'react';
import { DisciplinePage } from '@/features/protected/wellbeing/components/discipline-page';
import { ModuleGuard } from '@/features/protected/dashboard/components/module-guard';

export const metadata: Metadata = { title: 'Convivencia escolar' };

const Page = (): JSX.Element => (
  <ModuleGuard module="discipline">
    <DisciplinePage />
  </ModuleGuard>
);

export default Page;
