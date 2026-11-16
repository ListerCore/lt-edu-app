import type { Metadata } from 'next';
import type { JSX } from 'react';
import { ModuleGuard } from '@/features/protected/dashboard/components/module-guard';
import { AuditPage } from '@/features/protected/settings/components/audit-page';

export const metadata: Metadata = { title: 'Auditoría' };

// Append-only log of the changes made in the panel; dirección only
const Page = (): JSX.Element => (
  <ModuleGuard module="audit">
    <AuditPage />
  </ModuleGuard>
);

export default Page;
