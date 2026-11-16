import type { Metadata } from 'next';
import type { JSX } from 'react';
import { LibraryPage } from '@/features/protected/classroom/components/library-page';
import { ModuleGuard } from '@/features/protected/dashboard/components/module-guard';

export const metadata: Metadata = { title: 'Biblioteca' };

// Reusable material of the institution; staff only
const Page = (): JSX.Element => (
  <ModuleGuard module="classroom-library">
    <LibraryPage />
  </ModuleGuard>
);

export default Page;
