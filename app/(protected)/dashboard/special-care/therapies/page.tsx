import type { Metadata } from 'next';
import type { JSX } from 'react';
import { TherapiesPage } from '@/features/protected/wellbeing/components/therapies-page';
import { ModuleGuard } from '@/features/protected/dashboard/components/module-guard';

export const metadata: Metadata = { title: 'Terapias' };

const Page = (): JSX.Element => (
  <ModuleGuard module="therapies">
    <TherapiesPage />
  </ModuleGuard>
);

export default Page;
