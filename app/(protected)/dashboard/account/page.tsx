import type { Metadata } from 'next';
import type { JSX } from 'react';
import { AccountPage } from '@/features/protected/account/components/account-page';
import { ModuleGuard } from '@/features/protected/dashboard/components/module-guard';

export const metadata: Metadata = { title: 'Mi cuenta' };

const Page = (): JSX.Element => (
  <ModuleGuard module="account">
    <AccountPage />
  </ModuleGuard>
);

export default Page;
