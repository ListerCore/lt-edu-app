import type { Metadata } from 'next';
import type { JSX } from 'react';
import { PlacementPage } from '@/features/protected/people/components/placement-page';

export const metadata: Metadata = { title: 'Ubicación y convalidación' };

const Page = (): JSX.Element => <PlacementPage />;

export default Page;
