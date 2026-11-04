import type { Metadata } from 'next';
import type { JSX } from 'react';
import { NotificationsPage } from '@/features/protected/notifications/components/notifications-page';

export const metadata: Metadata = { title: 'Notificaciones' };

const Page = (): JSX.Element => <NotificationsPage />;

export default Page;
