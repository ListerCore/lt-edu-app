import type { Metadata } from 'next';
import type { JSX } from 'react';
import { CurriculaPage } from '@/features/protected/academic/components/curricula-page';

export const metadata: Metadata = { title: 'Plan de estudios' };

const Page = (): JSX.Element => <CurriculaPage />;

export default Page;
