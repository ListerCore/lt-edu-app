import type { Metadata } from 'next';
import type { JSX } from 'react';
import { ClassroomPage } from '@/features/protected/classroom/components/classroom-page';
import { ModuleGuard } from '@/features/protected/dashboard/components/module-guard';

export const metadata: Metadata = { title: 'Aula virtual' };

// Rooms of the period; the API decides which ones the person reaches
const Page = (): JSX.Element => (
  <ModuleGuard module="classroom">
    <ClassroomPage />
  </ModuleGuard>
);

export default Page;
