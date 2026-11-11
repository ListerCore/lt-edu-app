import type { Metadata } from 'next';
import type { JSX } from 'react';
import { ClosingPage } from '@/features/protected/closing/components/closing-page';

export const metadata: Metadata = { title: 'Cierre y actas' };

const Page = (): JSX.Element => <ClosingPage />;

export default Page;
