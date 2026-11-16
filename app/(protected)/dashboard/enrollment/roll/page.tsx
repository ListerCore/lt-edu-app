import type { Metadata } from 'next';
import type { JSX } from 'react';
import { ModuleGuard } from '@/features/protected/dashboard/components/module-guard';
import { RollPage } from '@/features/protected/people/components/roll-page';

export const metadata: Metadata = { title: 'Nómina y SIAGIE' };

const Page = (): JSX.Element => (
  <ModuleGuard module="roll">
    <RollPage />
  </ModuleGuard>
);

export default Page;
