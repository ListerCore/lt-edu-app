import type { Metadata } from 'next';
import type { JSX } from 'react';
import { BankPage } from '@/features/protected/exams/components/bank-page';
import { ModuleGuard } from '@/features/protected/dashboard/components/module-guard';

export const metadata: Metadata = { title: 'Banco de preguntas' };

const Page = (): JSX.Element => (
  <ModuleGuard module="question-bank">
    <BankPage />
  </ModuleGuard>
);

export default Page;
