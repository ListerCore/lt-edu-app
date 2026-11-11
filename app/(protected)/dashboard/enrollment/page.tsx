import type { Metadata } from 'next';
import type { JSX } from 'react';
import { EnrollmentPage } from '@/features/protected/people/components/enrollment-page';

export const metadata: Metadata = { title: 'Matrícula' };

const Page = (): JSX.Element => <EnrollmentPage />;

export default Page;
