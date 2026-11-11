import type { Metadata } from 'next';
import type { JSX } from 'react';
import { PaymentsPage } from '@/features/protected/finance/components/payments-page';

export const metadata: Metadata = { title: 'Pensiones y pagos' };

const Page = (): JSX.Element => <PaymentsPage />;

export default Page;
