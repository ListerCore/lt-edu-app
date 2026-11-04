import type { Metadata } from 'next';
import type { JSX } from 'react';
import { NewsPage } from '@/features/public/news/components/news-page';

export const metadata: Metadata = {
  title: 'Comunicados',
  description: 'Comunicados, anuncios y avisos de la institución para estudiantes, familias y docentes.',
  alternates: { canonical: '/news' },
};

const Page = (): JSX.Element => <NewsPage />;

export default Page;
