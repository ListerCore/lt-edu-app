import type { Metadata } from 'next';
import type { JSX } from 'react';
import { ContactPage } from '@/features/public/contact/components/contact-page';

export const metadata: Metadata = {
  title: 'Contacto e informes',
  description: 'Consultas de admisión, matrícula, pensiones, certificados o acceso a tu cuenta. Respuesta en un día hábil y sede en Lima, Perú.',
  alternates: { canonical: '/contact' },
};

const Page = (): JSX.Element => <ContactPage />;

export default Page;
