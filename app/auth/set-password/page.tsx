import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense, type JSX } from 'react';
import { AuthCard } from '@/features/auth/components/auth-card';
import { PasswordSetupForm } from '@/features/auth/components/password-setup-form';

export const metadata: Metadata = { title: 'Nueva contraseña' };

// The form reads ?token from the URL, so it renders inside Suspense to keep the page prerenderable
const Page = (): JSX.Element => (
  <AuthCard
    id="setup-title"
    title="Crea tu nueva contraseña"
    description="Sirve para recuperar tu cuenta o para activar una invitación de tu institución."
    footer={
      <>
        ¿El enlace venció?{' '}
        <Link href="/auth/recovery-account" className="font-medium text-brand transition-colors hover:text-brand-solid-hover">
          <span className="link-underline">Solicitar otro</span>
        </Link>
      </>
    }
  >
    <Suspense>
      <PasswordSetupForm />
    </Suspense>
  </AuthCard>
);

export default Page;
