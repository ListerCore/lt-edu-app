import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { JSX } from 'react';
import { UUID_PATTERN } from '@/features/protected/academic/data/academic-data';
import { ModuleGuard } from '@/features/protected/dashboard/components/module-guard';
import { RoomParticipationPage } from '@/features/protected/participation/components/room-participation-page';

export const metadata: Metadata = { title: 'Registro de participación' };

// Rendered per request: the id comes from the URL and the data from the signed-in person's institution
export const instant = false;

const Page = async ({ params }: PageProps<'/dashboard/classroom/[id]/participation'>): Promise<JSX.Element> => {
  const { id } = await params;
  if (!UUID_PATTERN.test(id)) notFound();
  return (
    <ModuleGuard module="classroom">
      <RoomParticipationPage roomId={id} />
    </ModuleGuard>
  );
};

export default Page;
