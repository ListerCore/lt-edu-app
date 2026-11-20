import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { JSX } from 'react';
import { UUID_PATTERN } from '@/features/protected/academic/data/academic-data';
import { ModuleGuard } from '@/features/protected/dashboard/components/module-guard';
import { LiveRoomPage } from '@/features/protected/meetings/components/live-room-page';
import { isLiveSource } from '@/features/protected/meetings/data/meetings-data';

export const metadata: Metadata = { title: 'Clase en vivo' };

// Rendered per request: the session comes from the URL and the access from the signed-in person
export const instant = false;

const Page = async ({ params }: PageProps<'/dashboard/live/[source]/[id]'>): Promise<JSX.Element> => {
  const { source, id } = await params;
  if (!isLiveSource(source) || !UUID_PATTERN.test(id)) notFound();
  return (
    <ModuleGuard module="live-classes">
      <LiveRoomPage source={source} id={id} />
    </ModuleGuard>
  );
};

export default Page;
