import type { Metadata } from 'next';
import type { JSX } from 'react';
import { StructurePage } from '@/features/protected/academic/components/structure-page';
import { ModuleGuard } from '@/features/protected/dashboard/components/module-guard';

export const metadata: Metadata = { title: 'Estructura académica' };

const Page = (): JSX.Element => (
  <ModuleGuard module="structure">
    <StructurePage />
  </ModuleGuard>
);

export default Page;
