import type { Metadata } from 'next';
import type { JSX } from 'react';
import { EnrollmentPage } from '@/features/protected/people/components/enrollment-page';
import { ModuleGuard } from '@/features/protected/dashboard/components/module-guard';

export const metadata: Metadata = { title: 'Matrícula' };

const Page = (): JSX.Element => (
  <ModuleGuard module="enrollment">
    <EnrollmentPage />
  </ModuleGuard>
);

export default Page;
