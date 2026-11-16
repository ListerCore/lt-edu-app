import type { Metadata } from 'next';
import type { JSX } from 'react';
import { ModuleGuard } from '@/features/protected/dashboard/components/module-guard';
import { HelpPage } from '@/features/protected/help/components/help-page';

export const metadata: Metadata = { title: 'Guía rápida' };

// Everyone signed in reads the guides (the account module is everyone's)
const Page = (): JSX.Element => (
  <ModuleGuard module="account">
    <HelpPage />
  </ModuleGuard>
);

export default Page;
