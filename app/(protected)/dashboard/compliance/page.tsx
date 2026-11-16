import type { Metadata } from 'next';
import type { JSX } from 'react';
import { CompliancePage } from '@/features/protected/compliance/components/compliance-page';
import { ModuleGuard } from '@/features/protected/dashboard/components/module-guard';

export const metadata: Metadata = { title: 'Cumplimiento DRE' };

const Page = (): JSX.Element => (
  <ModuleGuard module="compliance">
    <CompliancePage />
  </ModuleGuard>
);

export default Page;
