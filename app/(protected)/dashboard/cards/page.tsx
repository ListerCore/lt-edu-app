import type { Metadata } from 'next';
import type { JSX } from 'react';
import { CardsPage } from '@/features/protected/cards/components/cards-page';

export const metadata: Metadata = { title: 'Carnets' };

const Page = (): JSX.Element => <CardsPage />;

export default Page;
