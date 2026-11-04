import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense, type JSX } from 'react';
import { AuthCard } from '@/features/auth/components/auth-card';
import { TwoFactorDestination, TwoFactorForm } from '@/features/auth/components/two-factor-form';

export const metadata: Metadata = { title: 'Verificación en dos pasos' };

// Both pieces read ?email from the URL, so they render inside Suspense to keep the page prerenderable
const Page = (): JSX.Element => (
  <AuthCard
    id="two-factor-title"
    title="Verificación en dos pasos"
    description={
      <>
        Ingresa el código de 6 dígitos que enviamos a{' '}
        <Suspense fallback={<span>tu correo</span>}>
          <TwoFactorDestination />
        </Suspense>
        .
      </>
    }
    footer={
      <>
        ¿No eres tú?{' '}
        <Link href="/auth/signin" className="font-medium text-brand transition-colors hover:text-brand-solid-hover">
          <span className="link-underline">Ingresar con otra cuenta</span>
        </Link>
      </>
    }
  >
    <Suspense>
      <TwoFactorForm />
    </Suspense>
  </AuthCard>
);

export default Page;
