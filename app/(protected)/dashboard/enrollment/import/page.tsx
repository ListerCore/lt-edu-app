import type { Metadata } from 'next';
import type { JSX } from 'react';
import { ModuleGuard } from '@/features/protected/dashboard/components/module-guard';
import { ImportRollPage } from '@/features/protected/people/components/import-roll-page';

export const metadata: Metadata = { title: 'Importar nómina' };

const Page = (): JSX.Element => (
  <ModuleGuard module="enrollment" action="create">
    <ImportRollPage />
  </ModuleGuard>
);

export default Page;
