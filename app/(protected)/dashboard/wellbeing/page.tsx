import type { Metadata } from 'next';
import type { JSX } from 'react';
import { AlertsPage } from '@/features/protected/wellbeing/components/alerts-page';

export const metadata: Metadata = { title: 'Alertas' };

const Page = (): JSX.Element => <AlertsPage />;

export default Page;
