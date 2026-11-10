import type { Metadata } from 'next';
import type { JSX } from 'react';
import { NewAnnouncementPage } from '@/features/protected/announcements/components/new-announcement-page';

export const metadata: Metadata = { title: 'Nueva publicación' };

const Page = (): JSX.Element => <NewAnnouncementPage />;

export default Page;
