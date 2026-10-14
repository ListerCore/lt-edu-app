import type { Metadata } from 'next';
import { AuthPage } from '@/features/public/auth/components/auth-page';

export const metadata: Metadata = {
  title: 'Recuperar contraseña | CEBA Joseph Lister',
  description: 'Solicita ayuda para recuperar el acceso a tu aula virtual.',
};

const ForgotPasswordPage = (): React.ReactNode => <AuthPage mode="forgot-password" />;

export default ForgotPasswordPage;
