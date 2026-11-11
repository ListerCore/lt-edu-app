import type { Metadata } from 'next';
import type { JSX } from 'react';
import { BankPage } from '@/features/protected/exams/components/bank-page';

export const metadata: Metadata = { title: 'Banco de preguntas' };

const Page = (): JSX.Element => <BankPage />;

export default Page;
