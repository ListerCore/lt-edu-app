import type { Metadata } from 'next';
import type { JSX } from 'react';
import { PlacementPage } from '@/features/protected/people/components/placement-page';
import { ModuleGuard } from '@/features/protected/dashboard/components/module-guard';

export const metadata: Metadata = { title: 'Ubicación y convalidación' };

const Page = (): JSX.Element => (
  <ModuleGuard module="placement">
    <PlacementPage />
  </ModuleGuard>
);

export default Page;
