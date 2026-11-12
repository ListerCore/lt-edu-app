import type { Metadata } from 'next';
import type { JSX } from 'react';
import { InternshipsPage } from '@/features/protected/programs/components/internships-page';
import { ModuleGuard } from '@/features/protected/dashboard/components/module-guard';

export const metadata: Metadata = { title: 'Experiencias formativas' };

const Page = (): JSX.Element => (
  <ModuleGuard module="internships">
    <InternshipsPage />
  </ModuleGuard>
);

export default Page;
