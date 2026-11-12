import type { Metadata } from 'next';
import type { JSX } from 'react';
import { PeriodsPage } from '@/features/protected/academic/components/periods-page';
import { ModuleGuard } from '@/features/protected/dashboard/components/module-guard';

export const metadata: Metadata = { title: 'Periodos' };

const Page = (): JSX.Element => (
  <ModuleGuard module="periods">
    <PeriodsPage />
  </ModuleGuard>
);

export default Page;
