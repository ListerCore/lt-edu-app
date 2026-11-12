import type { Metadata } from 'next';
import type { JSX } from 'react';
import { MocksPage } from '@/features/protected/exams/components/mocks-page';
import { ModuleGuard } from '@/features/protected/dashboard/components/module-guard';

export const metadata: Metadata = { title: 'Simulacros' };

const Page = (): JSX.Element => (
  <ModuleGuard module="mock-exams">
    <MocksPage />
  </ModuleGuard>
);

export default Page;
