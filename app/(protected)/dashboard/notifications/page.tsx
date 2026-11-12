import type { Metadata } from 'next';
import type { JSX } from 'react';
import { NotificationsPage } from '@/features/protected/notifications/components/notifications-page';
import { ModuleGuard } from '@/features/protected/dashboard/components/module-guard';

export const metadata: Metadata = { title: 'Notificaciones' };

const Page = (): JSX.Element => (
  <ModuleGuard module="notifications">
    <NotificationsPage />
  </ModuleGuard>
);

export default Page;
