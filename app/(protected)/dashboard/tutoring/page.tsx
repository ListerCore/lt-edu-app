import type { Metadata } from 'next';
import type { JSX } from 'react';
import { TutoringPage } from '@/features/protected/wellbeing/components/tutoring-page';
import { ModuleGuard } from '@/features/protected/dashboard/components/module-guard';

export const metadata: Metadata = { title: 'Tutoría' };

const Page = (): JSX.Element => (
  <ModuleGuard module="tutoring">
    <TutoringPage />
  </ModuleGuard>
);

export default Page;
