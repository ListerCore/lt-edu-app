import type { Metadata } from 'next';
import type { JSX } from 'react';
import { ModuleGuard } from '@/features/protected/dashboard/components/module-guard';
import { InstitutionPage } from '@/features/protected/settings/components/institution-page';

export const metadata: Metadata = { title: 'Institución' };

// Authorizations and, in a CEBA, the e-learning platform sheet; the API checks the role on every call too
const Page = (): JSX.Element => (
  <ModuleGuard module="institution">
    <InstitutionPage />
  </ModuleGuard>
);

export default Page;
