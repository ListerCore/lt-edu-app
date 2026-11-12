import type { Metadata } from 'next';
import type { JSX } from 'react';
import { PlansPage } from '@/features/protected/wellbeing/components/plans-page';
import { ModuleGuard } from '@/features/protected/dashboard/components/module-guard';

export const metadata: Metadata = { title: 'Planes de orientación individual' };

const Page = (): JSX.Element => (
  <ModuleGuard module="individual-plans">
    <PlansPage />
  </ModuleGuard>
);

export default Page;
