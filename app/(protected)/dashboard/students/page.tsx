import type { Metadata } from 'next';
import type { JSX } from 'react';
import { StudentsPage } from '@/features/protected/people/components/students-page';
import { ModuleGuard } from '@/features/protected/dashboard/components/module-guard';

export const metadata: Metadata = { title: 'Estudiantes' };

const Page = (): JSX.Element => (
  <ModuleGuard module="students">
    <StudentsPage />
  </ModuleGuard>
);

export default Page;
