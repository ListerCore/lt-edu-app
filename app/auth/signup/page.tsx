import type { Metadata } from 'next';
import { AuthPage } from '@/features/auth/components/auth-page';

export const metadata: Metadata = {
  title: 'Crear cuenta | CEBA Joseph Lister',
  description: 'Crea tu acceso al aula virtual de CEBA Joseph Lister.',
};

const SignUpPage = (): React.ReactNode => <AuthPage mode="signup" />;

export default SignUpPage;
