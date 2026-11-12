import type { Metadata } from 'next';
import type { JSX } from 'react';
import { StaffAttendancePage } from '@/features/protected/attendance/components/staff-attendance-page';
import { ModuleGuard } from '@/features/protected/dashboard/components/module-guard';

export const metadata: Metadata = { title: 'Asistencia del personal' };

const Page = (): JSX.Element => (
  <ModuleGuard module="staff-attendance">
    <StaffAttendancePage />
  </ModuleGuard>
);

export default Page;
