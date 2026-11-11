import type { Metadata } from 'next';
import type { JSX } from 'react';
import { DisciplinePage } from '@/features/protected/wellbeing/components/discipline-page';

export const metadata: Metadata = { title: 'Convivencia escolar' };

const Page = (): JSX.Element => <DisciplinePage />;

export default Page;
