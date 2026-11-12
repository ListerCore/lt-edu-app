import type { Metadata } from 'next';
import type { JSX } from 'react';
import { AnnouncementDetailPage } from '@/features/protected/announcements/components/announcement-detail-page';
import { ModuleGuard } from '@/features/protected/dashboard/components/module-guard';

export const metadata: Metadata = { title: 'Publicación' };

// Per-user data (role, permissions) behind the session: rendered on request, never prerendered
export const instant = false;

const Page = async ({ params }: PageProps<'/dashboard/announcements/[slug]'>): Promise<JSX.Element> => (
  <ModuleGuard module="announcements">
    <AnnouncementDetailPage slug={(await params).slug} />
  </ModuleGuard>
);

export default Page;
