import type { Metadata } from 'next';
import type { JSX } from 'react';
import { MocksPage } from '@/features/protected/exams/components/mocks-page';

export const metadata: Metadata = { title: 'Simulacros' };

const Page = (): JSX.Element => <MocksPage />;

export default Page;
