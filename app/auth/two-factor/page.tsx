import type { Metadata } from 'next';
import { AuthPage } from '@/features/public/auth/components/auth-page';

export const metadata: Metadata = {
  title: 'Verificación en dos pasos | CEBA Joseph Lister',
  description: 'Verifica tu identidad con el código de autenticación o un código de respaldo.',
};

const TwoFactorPage = (): React.ReactNode => <AuthPage mode="two-factor" />;

export default TwoFactorPage;
