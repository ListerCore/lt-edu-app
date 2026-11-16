import type { Metadata } from 'next';
import type { JSX } from 'react';
import { ModuleGuard } from '@/features/protected/dashboard/components/module-guard';
import { UsersPage } from '@/features/protected/settings/components/users-page';

export const metadata: Metadata = { title: 'Usuarios y roles' };

// Staff access of the institution; dirección only (the API answers members_forbidden otherwise)
const Page = (): JSX.Element => (
  <ModuleGuard module="users">
    <UsersPage />
  </ModuleGuard>
);

export default Page;
