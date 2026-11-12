import type { Metadata } from 'next';
import type { JSX } from 'react';
import { PaymentsPage } from '@/features/protected/finance/components/payments-page';
import { ModuleGuard } from '@/features/protected/dashboard/components/module-guard';

// Neutral title: public institutions charge no tuition, so the page is "Pagos" there and "Pensiones y pagos" in private ones
export const metadata: Metadata = { title: 'Pagos' };

const Page = (): JSX.Element => (
  <ModuleGuard module="payments">
    <PaymentsPage />
  </ModuleGuard>
);

export default Page;
