import type { Metadata } from 'next';
import Link from 'next/link';
import type { JSX } from 'react';
import { AuthCard } from '@/features/auth/components/auth-card';
import { SignUpForm } from '@/features/auth/components/sign-up-form';

export const metadata: Metadata = { title: 'Crear cuenta' };

const Page = (): JSX.Element => (
  <AuthCard
    id="signup-title"
    title="Crea tu cuenta"
    description="Usa el correo que registró tu institución. La plataforma reconoce automáticamente a qué institución perteneces y qué rol tienes."
    footer={
      <>
        ¿Ya tienes una cuenta?{' '}
        <Link href="/auth/signin" className="font-medium text-brand transition-colors hover:text-brand-solid-hover">
          <span className="link-underline">Ingresar</span>
        </Link>
      </>
    }
  >
    <SignUpForm />
  </AuthCard>
);

export default Page;
