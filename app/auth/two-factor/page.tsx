import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense, type JSX } from 'react';
import { AuthCard } from '@/features/auth/components/auth-card';
import { TwoFactorForm } from '@/features/auth/components/two-factor-form';

export const metadata: Metadata = { title: 'Verificación en dos pasos' };

// The form is a client island; Suspense keeps the page prerenderable
const Page = (): JSX.Element => (
  <AuthCard
    id="two-factor-title"
    title="Verificación en dos pasos"
    description="Abre tu app autenticadora (Google Authenticator u otra) e ingresa el código de 6 dígitos de ListerCore Edu."
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
