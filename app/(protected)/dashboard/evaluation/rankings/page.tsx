import type { Metadata } from 'next';
import type { JSX } from 'react';
import { RankingsPage } from '@/features/protected/exams/components/rankings-page';
import { ModuleGuard } from '@/features/protected/dashboard/components/module-guard';

export const metadata: Metadata = { title: 'Ranking' };

const Page = (): JSX.Element => (
  <ModuleGuard module="rankings">
    <RankingsPage />
  </ModuleGuard>
);

export default Page;
