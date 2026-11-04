import type { Metadata } from 'next';
import Link from 'next/link';
import type { JSX } from 'react';
import { AuthCard } from '@/features/auth/components/auth-card';
import { ChangePasswordForm } from '@/features/auth/components/change-password-form';

export const metadata: Metadata = { title: 'Cambiar contraseña' };

const Page = (): JSX.Element => (
  <AuthCard
    id="change-title"
    title="Cambia tu contraseña"
    description="Si tu institución te dio una contraseña temporal, reemplázala por una que solo tú conozcas."
    footer={
      <>
        ¿No recuerdas la actual?{' '}
        <Link href="/auth/recovery-account" className="font-medium text-brand transition-colors hover:text-brand-solid-hover">
          <span className="link-underline">Recuperar cuenta</span>
        </Link>
      </>
    }
  >
    <ChangePasswordForm />
  </AuthCard>
);

export default Page;
