import type { Metadata } from 'next';
import type { JSX } from 'react';
import { PrivacyPage } from '@/features/public/legal/components/privacy-page';

export const metadata: Metadata = {
  title: 'Política de privacidad',
  description: 'Cómo Joseph trata los datos personales de quienes solicitan la plataforma y de las instituciones clientes, conforme a la Ley N.° 29733.',
  alternates: { canonical: '/legal/privacy' },
};

const Page = (): JSX.Element => <PrivacyPage />;

export default Page;
