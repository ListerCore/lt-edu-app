import type { Metadata } from 'next';
import type { JSX } from 'react';
import { AlertsPage } from '@/features/protected/wellbeing/components/alerts-page';
import { ModuleGuard } from '@/features/protected/dashboard/components/module-guard';

export const metadata: Metadata = { title: 'Alertas' };

const Page = (): JSX.Element => (
  <ModuleGuard module="wellbeing">
    <AlertsPage />
  </ModuleGuard>
);

export default Page;
