import type { Metadata } from 'next';
import type { JSX } from 'react';
import { CertificatesPage } from '@/features/protected/programs/components/records-pages';

export const metadata: Metadata = { title: 'Certificados' };

const Page = (): JSX.Element => <CertificatesPage />;

export default Page;
