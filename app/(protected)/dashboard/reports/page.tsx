import type { Metadata } from 'next';
import type { JSX } from 'react';
import { ReportsPage } from '@/features/protected/reports/components/reports-page';

export const metadata: Metadata = { title: 'Reportes' };

const Page = (): JSX.Element => <ReportsPage />;

export default Page;
