import type { Metadata } from 'next';
import type { JSX } from 'react';
import { TutoringPage } from '@/features/protected/wellbeing/components/tutoring-page';

export const metadata: Metadata = { title: 'Tutoría' };

const Page = (): JSX.Element => <TutoringPage />;

export default Page;
