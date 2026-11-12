import type { Metadata } from 'next';
import type { JSX } from 'react';
import { StudentAttendancePage } from '@/features/protected/attendance/components/student-attendance-page';
import { ModuleGuard } from '@/features/protected/dashboard/components/module-guard';

export const metadata: Metadata = { title: 'Asistencia de estudiantes' };

const Page = (): JSX.Element => (
  <ModuleGuard module="student-attendance">
    <StudentAttendancePage />
  </ModuleGuard>
);

export default Page;
