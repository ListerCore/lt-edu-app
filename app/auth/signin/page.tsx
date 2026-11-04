import type { Metadata } from 'next';
import Link from 'next/link';
import type { JSX } from 'react';
import { AuthCard } from '@/features/auth/components/auth-card';
import { SignInForm } from '@/features/auth/components/sign-in-form';

export const metadata: Metadata = { title: 'Ingresar' };

const Page = (): JSX.Element => (
  <AuthCard
    id="signin-title"
    title="Ingresar a la plataforma"
    description="Ingresa con tu correo; la plataforma abre tu institución con los módulos de tu rol."
    footer={
      <>
        ¿Aún no tienes cuenta?{' '}
        <Link href="/auth/signup" className="font-medium text-brand transition-colors hover:text-brand-solid-hover">
          <span className="link-underline">Crear cuenta</span>
        </Link>
      </>
    }
  >
    <SignInForm />
  </AuthCard>
);

export default Page;
