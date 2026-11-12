import type { Metadata } from 'next';
import type { JSX } from 'react';
import { NewStudentPage } from '@/features/protected/people/components/new-student-page';
import { ModuleGuard } from '@/features/protected/dashboard/components/module-guard';

export const metadata: Metadata = { title: 'Nuevo estudiante' };

const Page = (): JSX.Element => (
  <ModuleGuard module="students" action="create">
    <NewStudentPage />
  </ModuleGuard>
);

export default Page;
