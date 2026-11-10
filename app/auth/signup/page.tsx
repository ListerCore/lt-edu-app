import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense, type JSX } from 'react';
import { AuthCard } from '@/features/auth/components/auth-card';
import { AuthErrorNotice } from '@/features/auth/components/auth-error-notice';
import { SignUpForm } from '@/features/auth/components/sign-up-form';

export const metadata: Metadata = { title: 'Crear cuenta' };

const Page = (): JSX.Element => (
  <AuthCard
    id="signup-title"
    title="Crea tu cuenta"
    description="Usa el correo que registraste en secretaría; tu rol (estudiante, apoderado, docente o personal) se asigna automáticamente."
    footer={
      <>
        ¿Ya tienes una cuenta?{' '}
        <Link href="/auth/signin" className="font-medium text-brand transition-colors hover:text-brand-solid-hover">
          <span className="link-underline">Ingresar</span>
        </Link>
      </>
    }
  >
    <div className="flex flex-col gap-5">
      {/* Reason a redirect (Google) sent the visitor back; reads ?error, so it stays inside Suspense */}
      <Suspense>
        <AuthErrorNotice />
      </Suspense>
      <SignUpForm />
    </div>
  </AuthCard>
);

export default Page;
