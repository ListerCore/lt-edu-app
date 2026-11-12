import type { Metadata } from 'next';
import type { JSX } from 'react';
import { PsychologyPage } from '@/features/protected/wellbeing/components/psychology-page';
import { ModuleGuard } from '@/features/protected/dashboard/components/module-guard';

export const metadata: Metadata = { title: 'Psicología' };

const Page = (): JSX.Element => (
  <ModuleGuard module="psychology">
    <PsychologyPage />
  </ModuleGuard>
);

export default Page;
