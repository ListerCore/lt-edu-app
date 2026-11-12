import type { Metadata } from 'next';
import type { JSX } from 'react';
import { CertificatesPage } from '@/features/protected/programs/components/records-pages';
import { ModuleGuard } from '@/features/protected/dashboard/components/module-guard';

export const metadata: Metadata = { title: 'Certificados' };

const Page = (): JSX.Element => (
  <ModuleGuard module="certificates">
    <CertificatesPage />
  </ModuleGuard>
);

export default Page;
