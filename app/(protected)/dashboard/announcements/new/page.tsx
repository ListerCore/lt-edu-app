import type { Metadata } from 'next';
import type { JSX } from 'react';
import { NewAnnouncementPage } from '@/features/protected/announcements/components/new-announcement-page';
import { ModuleGuard } from '@/features/protected/dashboard/components/module-guard';

export const metadata: Metadata = { title: 'Nueva publicación' };

const Page = (): JSX.Element => (
  <ModuleGuard module="announcements" action="create">
    <NewAnnouncementPage />
  </ModuleGuard>
);

export default Page;
