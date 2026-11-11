import type { Metadata } from 'next';
import type { JSX } from 'react';
import { AttentionModesPage } from '@/features/protected/academic/components/attention-modes-page';

export const metadata: Metadata = { title: 'Formas de atención' };

const Page = (): JSX.Element => <AttentionModesPage />;

export default Page;
