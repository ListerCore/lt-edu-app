import type { Metadata } from 'next';
import type { JSX } from 'react';
import { ReportCardsPage } from '@/features/protected/assessment/components/report-cards-page';
import { ModuleGuard } from '@/features/protected/dashboard/components/module-guard';

export const metadata: Metadata = { title: 'Libretas' };

const Page = (): JSX.Element => (
  <ModuleGuard module="report-cards">
    <ReportCardsPage />
  </ModuleGuard>
);

export default Page;
