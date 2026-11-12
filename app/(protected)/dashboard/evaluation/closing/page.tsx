import type { Metadata } from 'next';
import type { JSX } from 'react';
import { ClosingPage } from '@/features/protected/closing/components/closing-page';
import { ModuleGuard } from '@/features/protected/dashboard/components/module-guard';

export const metadata: Metadata = { title: 'Cierre y actas' };

const Page = (): JSX.Element => (
  <ModuleGuard module="closing">
    <ClosingPage />
  </ModuleGuard>
);

export default Page;
