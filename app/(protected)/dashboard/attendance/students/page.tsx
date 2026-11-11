import type { Metadata } from 'next';
import type { JSX } from 'react';
import { StudentAttendancePage } from '@/features/protected/attendance/components/student-attendance-page';

export const metadata: Metadata = { title: 'Asistencia de estudiantes' };

const Page = (): JSX.Element => <StudentAttendancePage />;

export default Page;
