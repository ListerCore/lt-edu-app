import type { Metadata } from 'next';
import type { JSX } from 'react';
import { ReportsPage } from '@/features/protected/reports/components/reports-page';
import { ModuleGuard } from '@/features/protected/dashboard/components/module-guard';

export const metadata: Metadata = { title: 'Reportes' };

const Page = (): JSX.Element => (
  <ModuleGuard module="reports">
    <ReportsPage />
  </ModuleGuard>
);

export default Page;
