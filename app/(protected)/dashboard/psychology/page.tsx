import type { Metadata } from 'next';
import type { JSX } from 'react';
import { PsychologyPage } from '@/features/protected/wellbeing/components/psychology-page';

export const metadata: Metadata = { title: 'Psicología' };

const Page = (): JSX.Element => <PsychologyPage />;

export default Page;
