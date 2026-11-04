import type { Metadata } from 'next';
import Link from 'next/link';
import type { JSX } from 'react';
import { AuthCard } from '@/features/auth/components/auth-card';
import { ForgotPasswordForm } from '@/features/auth/components/forgot-password-form';

export const metadata: Metadata = { title: 'Recuperar cuenta' };

const Page = (): JSX.Element => (
  <AuthCard
    id="forgot-title"
    title="Recupera tu cuenta"
    description="Escribe el correo de tu cuenta y te enviaremos un enlace para crear una nueva."
    footer={
      <>
        ¿La recordaste?{' '}
        <Link href="/auth/signin" className="font-medium text-brand transition-colors hover:text-brand-solid-hover">
          <span className="link-underline">Volver a ingresar</span>
        </Link>
      </>
    }
  >
    <ForgotPasswordForm />
  </AuthCard>
);

export default Page;
