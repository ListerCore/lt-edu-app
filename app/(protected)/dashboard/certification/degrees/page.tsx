import type { Metadata } from 'next';
import type { JSX } from 'react';
import { DegreesPage } from '@/features/protected/programs/components/records-pages';
import { ModuleGuard } from '@/features/protected/dashboard/components/module-guard';

export const metadata: Metadata = { title: 'Titulación' };

const Page = (): JSX.Element => (
  <ModuleGuard module="degrees">
    <DegreesPage />
  </ModuleGuard>
);

export default Page;
