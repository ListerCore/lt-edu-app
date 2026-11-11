import type { Metadata } from 'next';
import type { JSX } from 'react';
import { StaffListPage } from '@/features/protected/staff/components/staff-pages';

export const metadata: Metadata = { title: 'Docentes y personal' };

const Page = (): JSX.Element => <StaffListPage />;

export default Page;
