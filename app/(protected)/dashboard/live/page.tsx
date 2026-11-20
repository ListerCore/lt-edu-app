import type { Metadata } from 'next';
import type { JSX } from 'react';
import { ModuleGuard } from '@/features/protected/dashboard/components/module-guard';
import { LiveAgendaPage } from '@/features/protected/meetings/components/live-agenda-page';

export const metadata: Metadata = { title: 'Clases en vivo' };

const Page = (): JSX.Element => (
  <ModuleGuard module="live-classes">
    <LiveAgendaPage />
  </ModuleGuard>
);

export default Page;
