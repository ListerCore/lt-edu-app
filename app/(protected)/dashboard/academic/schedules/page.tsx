import type { Metadata } from 'next';
import type { JSX } from 'react';
import { SchedulesPage } from '@/features/protected/schedules/components/schedules-page';
import { ModuleGuard } from '@/features/protected/dashboard/components/module-guard';

export const metadata: Metadata = { title: 'Horarios' };

const Page = (): JSX.Element => (
  <ModuleGuard module="schedules">
    <SchedulesPage />
  </ModuleGuard>
);

export default Page;
