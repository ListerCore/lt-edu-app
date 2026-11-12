import type { Metadata } from 'next';
import type { JSX } from 'react';
import { CardsPage } from '@/features/protected/cards/components/cards-page';
import { ModuleGuard } from '@/features/protected/dashboard/components/module-guard';

export const metadata: Metadata = { title: 'Carnets' };

const Page = (): JSX.Element => (
  <ModuleGuard module="cards">
    <CardsPage />
  </ModuleGuard>
);

export default Page;
