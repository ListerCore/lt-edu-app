import type { Metadata } from 'next';
import type { JSX } from 'react';
import { StructurePage } from '@/features/protected/academic/components/structure-page';

export const metadata: Metadata = { title: 'Estructura académica' };

const Page = (): JSX.Element => <StructurePage />;

export default Page;
