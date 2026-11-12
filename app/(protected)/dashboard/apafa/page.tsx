import type { Metadata } from 'next';
import type { JSX } from 'react';
import { ApafaPage } from '@/features/protected/apafa/components/apafa-page';
import { ModuleGuard } from '@/features/protected/dashboard/components/module-guard';

export const metadata: Metadata = { title: 'APAFA' };

// Public institutions only: ModuleGuard answers 403 in private ones (managementModules), and so does the API
const Page = (): JSX.Element => (
  <ModuleGuard module="apafa">
    <ApafaPage />
  </ModuleGuard>
);

export default Page;
