import type { Metadata } from 'next';
import type { JSX } from 'react';
import { ReportsPage } from '@/features/private/reports/components/reports-page';

export const metadata: Metadata = {
  title: 'Reportes institucionales y SIAGIE | SIGE-JL',
  description: 'Indicadores institucionales, consolidado EBA y reportes oficiales para SIAGIE.',
};

const DashboardReportsPage = (): JSX.Element => <ReportsPage />;

export default DashboardReportsPage;
