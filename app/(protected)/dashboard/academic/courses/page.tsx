import type { Metadata } from 'next';
import type { JSX } from 'react';
import { CurriculaPage } from '@/features/protected/academic/components/curricula-page';
import { ModuleGuard } from '@/features/protected/dashboard/components/module-guard';

export const metadata: Metadata = { title: 'Plan de estudios' };

const Page = (): JSX.Element => (
  <ModuleGuard module="courses">
    <CurriculaPage />
  </ModuleGuard>
);

export default Page;
