import type { Metadata } from 'next';
import type { JSX } from 'react';
import { PrivacyPage } from '@/features/public/legal/components/privacy-page';

export const metadata: Metadata = {
  title: 'Política de privacidad',
  description: 'Cómo la institución trata los datos personales de postulantes, estudiantes, apoderados y personal, conforme a la Ley N.° 29733.',
  alternates: { canonical: '/legal/privacy' },
};

const Page = (): JSX.Element => <PrivacyPage />;

export default Page;
