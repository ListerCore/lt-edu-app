import type { Metadata } from 'next';
import type { JSX } from 'react';
import { RankingsPage } from '@/features/protected/exams/components/rankings-page';

export const metadata: Metadata = { title: 'Ranking' };

const Page = (): JSX.Element => <RankingsPage />;

export default Page;
