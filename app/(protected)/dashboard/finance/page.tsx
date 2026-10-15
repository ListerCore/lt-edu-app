import type { Metadata } from 'next';
import type { JSX } from 'react';
import { FinancePage } from '@/features/protected/finance/components/finance-page';

export const metadata: Metadata = {
  title: 'Gestión económica y pensiones | SIGE-JL',
  description: 'Administración de pensiones EBA, pagos, comprobantes SUNAT y portal de apoderados.',
};

const DashboardFinancePage = (): JSX.Element => <FinancePage />;

export default DashboardFinancePage;
