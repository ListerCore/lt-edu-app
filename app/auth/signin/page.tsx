import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense, type JSX } from 'react';
import { AuthCard } from '@/features/auth/components/auth-card';
import { AuthErrorNotice } from '@/features/auth/components/auth-error-notice';
import { SignInForm } from '@/features/auth/components/sign-in-form';

export const metadata: Metadata = { title: 'Ingresar' };

const Page = (): JSX.Element => (
  <AuthCard
    id="signin-title"
    title="Ingresar a tu cuenta"
    description="Estudiantes, apoderados, docentes y personal ingresan con el correo registrado en secretaría."
    footer={
      <>
        ¿Aún no tienes cuenta?{' '}
        <Link href="/auth/signup" className="font-medium text-brand transition-colors hover:text-brand-solid-hover">
          <span className="link-underline">Crear cuenta</span>
        </Link>
      </>
    }
  >
    <div className="flex flex-col gap-5">
      {/* Reason a redirect (Google) sent the visitor back; reads ?error, so it stays inside Suspense */}
      <Suspense>
        <AuthErrorNotice />
      </Suspense>
      <SignInForm />
    </div>
  </AuthCard>
);

export default Page;
