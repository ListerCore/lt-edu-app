import type { Metadata } from 'next';
import type { JSX } from 'react';
import { DegreesPage } from '@/features/protected/programs/components/records-pages';

export const metadata: Metadata = { title: 'Titulación' };

const Page = (): JSX.Element => <DegreesPage />;

export default Page;
