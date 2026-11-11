import type { Metadata } from 'next';
import type { JSX } from 'react';
import { InternshipsPage } from '@/features/protected/programs/components/internships-page';

export const metadata: Metadata = { title: 'Experiencias formativas' };

const Page = (): JSX.Element => <InternshipsPage />;

export default Page;
