'use client';

import Link from 'next/link';
import type { FormEvent, JSX } from 'react';
import { LoaderCircle, UserPlus } from 'lucide';
import { FormField } from '@/components/layout/form-field';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { MorphIcon } from '@/components/ui/morph-icon';
import { useSignUp } from '../hooks/use-sign-up';
import type { SignUpValues } from '../types';
import { AuthDivider } from './auth-divider';
import { GoogleButton } from './google-button';
import { PasswordChecklist } from './password-checklist';
import { PasswordInput } from './password-input';
import { TurnstileField } from './turnstile-field';

const controlClassName = 'h-11 w-full rounded-lg bg-background';

// Account sign-up: the institution and role come from the registered email, so only personal credentials are asked
export const SignUpForm = (): JSX.Element => {
  const { values, errors, isPending, turnstileRef, setCaptchaToken, setField, submit } = useSignUp();

  const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    submit();
  };

  // aria wiring shared by every control that can show an error
  const describe = (field: keyof SignUpValues): { 'aria-invalid': boolean; 'aria-describedby'?: string } => ({ 'aria-invalid': Boolean(errors[field]), 'aria-describedby': errors[field] ? `signup-${field}-error` : undefined });

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={onSubmit} noValidate aria-label="Crear cuenta" className="flex flex-col gap-5">
        <FormField id="signup-fullName" label="Nombre completo" required error={errors.fullName}>
          <Input id="signup-fullName" autoComplete="name" placeholder="Ej. María Quispe Huamán" value={values.fullName} onChange={(event): void => setField('fullName', event.target.value)} className={controlClassName} {...describe('fullName')} />
        </FormField>

        <FormField id="signup-email" label="Correo" required error={errors.email}>
          <Input id="signup-email" type="email" autoComplete="email" inputMode="email" placeholder="nombre@institucion.edu.pe" value={values.email} onChange={(event): void => setField('email', event.target.value)} className={controlClassName} {...describe('email')} />
        </FormField>

        <div className="flex flex-col gap-3">
          <FormField id="signup-password" label="Contraseña" required error={errors.password}>
            <PasswordInput id="signup-password" autoComplete="new-password" placeholder="Crea una contraseña" value={values.password} onChange={(event): void => setField('password', event.target.value)} className={controlClassName} {...describe('password')} />
          </FormField>
          <PasswordChecklist password={values.password} />
        </div>

        <FormField id="signup-confirm" label="Confirmar contraseña" required error={errors.confirm}>
          <PasswordInput id="signup-confirm" autoComplete="new-password" placeholder="Repite la contraseña" value={values.confirm} onChange={(event): void => setField('confirm', event.target.value)} className={controlClassName} {...describe('confirm')} />
        </FormField>

        <div>
          <label className="flex cursor-pointer items-start gap-3 rounded-lg bg-surface p-4 text-xs leading-relaxed text-muted-foreground">
            <Checkbox className="mt-0.5" checked={values.terms} onCheckedChange={(next): void => setField('terms', next)} {...describe('terms')} />
            <span>
              Acepto los{' '}
              <Link href="/legal/terms" className="font-medium text-brand underline decoration-dotted underline-offset-4">
                Términos y condiciones
              </Link>{' '}
              y la{' '}
              <Link href="/legal/privacy" className="font-medium text-brand underline decoration-dotted underline-offset-4">
                Política de privacidad
              </Link>
              . <span className="text-brand">*</span>
            </span>
          </label>
          {errors.terms && (
            <p id="signup-terms-error" role="alert" className="mt-2 text-xs text-destructive">
              {errors.terms}
            </p>
          )}
        </div>

        <TurnstileField turnstileRef={turnstileRef} error={errors.captcha} onToken={setCaptchaToken} />

        <button type="submit" disabled={isPending} className="btn-brand mt-1 h-11 w-full">
          <MorphIcon icon={isPending ? LoaderCircle : UserPlus} size={16} className={isPending ? 'animate-spin' : ''} />
          {isPending ? 'Creando cuenta…' : 'Crear cuenta'}
        </button>
      </form>

      <AuthDivider label="o continúa con" />
      <GoogleButton />
    </div>
  );
};
