import type { Metadata } from 'next';
import type { JSX } from 'react';
import { ModuleGuard } from '@/features/protected/dashboard/components/module-guard';
import { VirtualTutoringPage } from '@/features/protected/tutoring/components/virtual-tutoring-page';

export const metadata: Metadata = { title: 'Tutoría virtual' };

const Page = (): JSX.Element => (
  <ModuleGuard module="virtual-tutoring">
    <VirtualTutoringPage />
  </ModuleGuard>
);

export default Page;
