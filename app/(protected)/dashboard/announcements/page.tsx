import type { Metadata } from 'next';
import type { JSX } from 'react';
import { AnnouncementsPage } from '@/features/protected/announcements/components/announcements-page';
import { ModuleGuard } from '@/features/protected/dashboard/components/module-guard';

export const metadata: Metadata = { title: 'Comunicados' };

const Page = (): JSX.Element => (
  <ModuleGuard module="announcements">
    <AnnouncementsPage />
  </ModuleGuard>
);

export default Page;
