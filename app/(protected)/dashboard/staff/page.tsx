import type { Metadata } from 'next';
import type { JSX } from 'react';
import { StaffListPage } from '@/features/protected/staff/components/staff-pages';
import { ModuleGuard } from '@/features/protected/dashboard/components/module-guard';

export const metadata: Metadata = { title: 'Docentes y personal' };

const Page = (): JSX.Element => (
  <ModuleGuard module="staff">
    <StaffListPage />
  </ModuleGuard>
);

export default Page;
