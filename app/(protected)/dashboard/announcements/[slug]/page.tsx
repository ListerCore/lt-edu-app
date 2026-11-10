import type { Metadata } from 'next';
import type { JSX } from 'react';
import { AnnouncementDetailPage } from '@/features/protected/announcements/components/announcement-detail-page';

export const metadata: Metadata = { title: 'Publicación' };

// Per-user data (role, permissions) behind the session: rendered on request, never prerendered
export const instant = false;

const Page = async ({ params }: PageProps<'/dashboard/announcements/[slug]'>): Promise<JSX.Element> => <AnnouncementDetailPage slug={(await params).slug} />;

export default Page;
