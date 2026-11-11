import type { Metadata } from 'next';
import type { JSX } from 'react';
import { PlansPage } from '@/features/protected/wellbeing/components/plans-page';

export const metadata: Metadata = { title: 'Planes de orientación individual' };

const Page = (): JSX.Element => <PlansPage />;

export default Page;
