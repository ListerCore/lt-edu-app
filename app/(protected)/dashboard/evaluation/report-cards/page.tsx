import type { Metadata } from 'next';
import type { JSX } from 'react';
import { ReportCardsPage } from '@/features/protected/assessment/components/report-cards-page';

export const metadata: Metadata = { title: 'Libretas' };

const Page = (): JSX.Element => <ReportCardsPage />;

export default Page;
