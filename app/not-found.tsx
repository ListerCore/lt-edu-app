import type { Metadata } from 'next';
import { NotFoundPage } from '@/features/public/system/components/not-found-page';

export const metadata: Metadata = {
  title: 'Página no encontrada | CEBA Joseph Lister',
  description: 'No encontramos la página que buscas.',
};

const NotFound = (): React.ReactNode => <NotFoundPage />;

export default NotFound;
