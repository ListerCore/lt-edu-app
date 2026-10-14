import type { Metadata } from 'next';
import { AuthPage } from '@/features/public/auth/components/auth-page';

export const metadata: Metadata = {
  title: 'Iniciar sesión | CEBA Joseph Lister',
  description: 'Ingresa a tu aula virtual de CEBA Joseph Lister.',
};

const SignInPage = (): React.ReactNode => <AuthPage mode="signin" />;

export default SignInPage;
