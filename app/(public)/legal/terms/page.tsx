import type { Metadata } from 'next';
import type { JSX } from 'react';
import { TermsPage } from '@/features/public/legal/components/terms-page';

export const metadata: Metadata = {
  title: 'Términos y condiciones',
  description: 'Condiciones de uso del sitio, de la demo por tipo de institución y rol, y de la plataforma de gestión educativa Joseph.',
  alternates: { canonical: '/legal/terms' },
};

const Page = (): JSX.Element => <TermsPage />;

export default Page;
