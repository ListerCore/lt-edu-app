import type { Metadata } from 'next';
import { HelpCenterPage } from '@/features/public/help/components/help-center-page';

export const metadata: Metadata = {
  title: 'Centro de Ayuda y Tutoriales | CEBA Joseph Lister',
  description: 'Consulta tutoriales, guías y novedades para usar el aula virtual de CEBA Joseph Lister.',
};

const Page = (): React.ReactNode => <HelpCenterPage />;

export default Page;
