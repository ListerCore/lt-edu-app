import type { Metadata } from 'next';
import type { JSX } from 'react';
import { AnnouncementsPage } from '@/features/protected/announcements/components/announcements-page';

export const metadata: Metadata = { title: 'Comunicados' };

const Page = (): JSX.Element => <AnnouncementsPage />;

export default Page;
