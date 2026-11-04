import type { Metadata } from 'next';
import type { JSX } from 'react';
import { ContactPage } from '@/features/public/contact/components/contact-page';

export const metadata: Metadata = {
  title: 'Contacto: solicita la implementación',
  description: 'Escríbenos para implementar Joseph en tu colegio, CEBA, CEBE, centro pre-universitario o instituto. Respuesta en un día hábil y oficina en Lima, Perú.',
  alternates: { canonical: '/contact' },
};

const Page = (): JSX.Element => <ContactPage />;

export default Page;
