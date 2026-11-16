import type { Metadata } from 'next';
import type { JSX } from 'react';
import { ComplaintsPage } from '@/features/public/legal/components/complaints-page';

export const metadata: Metadata = {
  title: 'Libro de Reclamaciones',
  description: 'Libro de Reclamaciones virtual de ListerCore Edu para presentar reclamos y quejas conforme al Código de Protección y Defensa del Consumidor.',
  alternates: { canonical: '/legal/complaints' },
};

const Page = (): JSX.Element => <ComplaintsPage />;

export default Page;
