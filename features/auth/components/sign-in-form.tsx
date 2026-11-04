'use client';

import Link from 'next/link';
import type { FormEvent, JSX } from 'react';
import { LoaderCircle, LogIn } from 'lucide';
import { FormField } from '@/components/layout/form-field';
import { Input } from '@/components/ui/input';
import { MorphIcon } from '@/components/ui/morph-icon';
import { useSignIn } from '../hooks/use-sign-in';
import { AuthDivider } from './auth-divider';
import { GoogleButton } from './google-button';
import { PasswordInput } from './password-input';
import { TurnstileField } from './turnstile-field';

const controlClassName = 'h-11 w-full rounded-lg bg-background';

// Sign-in: email + password (then the 2FA step) or the Google placeholder below
export const SignInForm = (): JSX.Element => {
  const { values, errors, isPending, turnstileRef, setCaptchaToken, setField, submit } = useSignIn();

  const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    submit();
  };

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={onSubmit} noValidate aria-label="Ingresar" className="flex flex-col gap-5">
        <FormField id="signin-email" label="Correo" error={errors.email}>
          <Input id="signin-email" type="email" autoComplete="username" inputMode="email" placeholder="nombre@institucion.edu.pe" value={values.email} onChange={(event): void => setField('email', event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'signin-email-error' : undefined} className={controlClassName} />
        </FormField>

        <div className="flex flex-col gap-2">
          <FormField id="signin-password" label="Contraseña" error={errors.password}>
            <PasswordInput id="signin-password" autoComplete="current-password" placeholder="Tu contraseña" value={values.password} onChange={(event): void => setField('password', event.target.value)} aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? 'signin-password-error' : undefined} className={controlClassName} />
          </FormField>
          <Link href="/auth/recovery-account" className="self-end text-xs font-medium text-muted-foreground transition-colors hover:text-brand">
            <span className="link-underline">¿Olvidaste tu contraseña?</span>
          </Link>
        </div>

        <TurnstileField turnstileRef={turnstileRef} error={errors.captcha} onToken={setCaptchaToken} />

        <button type="submit" disabled={isPending} className="btn-brand mt-1 h-11 w-full">
          <MorphIcon icon={isPending ? LoaderCircle : LogIn} size={16} className={isPending ? 'animate-spin' : ''} />
          {isPending ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>

      <AuthDivider label="o continúa con" />
      <GoogleButton />
    </div>
  );
};
