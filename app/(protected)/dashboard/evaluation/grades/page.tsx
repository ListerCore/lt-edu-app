import type { Metadata } from 'next';
import type { JSX } from 'react';
import { GradesPage } from '@/features/protected/assessment/components/grades-page';

export const metadata: Metadata = { title: 'Notas' };

const Page = (): JSX.Element => <GradesPage />;

export default Page;
