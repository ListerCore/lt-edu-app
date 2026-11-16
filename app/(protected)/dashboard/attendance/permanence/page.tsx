import type { Metadata } from 'next';
import type { JSX } from 'react';
import { ModuleGuard } from '@/features/protected/dashboard/components/module-guard';
import { PermanencePage } from '@/features/protected/participation/components/permanence-page';

export const metadata: Metadata = { title: 'Permanencia a distancia' };

const Page = (): JSX.Element => (
  <ModuleGuard module="permanence">
    <PermanencePage />
  </ModuleGuard>
);

export default Page;
