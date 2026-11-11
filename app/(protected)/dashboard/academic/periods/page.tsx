import type { Metadata } from 'next';
import type { JSX } from 'react';
import { PeriodsPage } from '@/features/protected/academic/components/periods-page';

export const metadata: Metadata = { title: 'Periodos' };

const Page = (): JSX.Element => <PeriodsPage />;

export default Page;
