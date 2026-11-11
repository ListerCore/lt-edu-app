import type { Metadata } from 'next';
import type { JSX } from 'react';
import { StaffAttendancePage } from '@/features/protected/attendance/components/staff-attendance-page';

export const metadata: Metadata = { title: 'Asistencia del personal' };

const Page = (): JSX.Element => <StaffAttendancePage />;

export default Page;
