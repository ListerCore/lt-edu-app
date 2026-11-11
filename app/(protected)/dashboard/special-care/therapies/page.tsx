import type { Metadata } from 'next';
import type { JSX } from 'react';
import { TherapiesPage } from '@/features/protected/wellbeing/components/therapies-page';

export const metadata: Metadata = { title: 'Terapias' };

const Page = (): JSX.Element => <TherapiesPage />;

export default Page;
