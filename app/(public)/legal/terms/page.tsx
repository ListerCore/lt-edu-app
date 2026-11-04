import type { Metadata } from 'next';
import type { JSX } from 'react';
import { TermsPage } from '@/features/public/legal/components/terms-page';

export const metadata: Metadata = {
  title: 'Términos y condiciones',
  description: 'Condiciones de uso del sitio web y de las cuentas de estudiantes, apoderados, docentes y personal de la institución.',
  alternates: { canonical: '/legal/terms' },
};

const Page = (): JSX.Element => <TermsPage />;

export default Page;
