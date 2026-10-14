import type { Metadata } from 'next';
import { AuthPage } from '@/features/public/auth/components/auth-page';

export const metadata: Metadata = {
  title: 'Configurar contraseña | CEBA Joseph Lister',
  description: 'Configura una contraseña para tu primer ingreso al aula virtual.',
};

const PasswordSetupPage = (): React.ReactNode => <AuthPage mode="setup-password" />;

export default PasswordSetupPage;
