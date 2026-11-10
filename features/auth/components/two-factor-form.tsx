'use client';

import { useSearchParams } from 'next/navigation';
import type { FormEvent, JSX } from 'react';
import { LoaderCircle, ShieldCheck } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { maskEmail } from '../data/auth-data';
import { useTwoFactor } from '../hooks/use-two-factor';
import { OtpInput } from './otp-input';

// Masked destination of the code; reads the query so it must sit under a Suspense boundary
export const TwoFactorDestination = (): JSX.Element => {
  const params = useSearchParams();
  const email = params.get('email');
  if (params.get('method') === 'totp') return <span>tu app autenticadora (o usa un código de respaldo)</span>;
  return email ? <span className="font-medium text-foreground">{maskEmail(email)}</span> : <span>tu correo</span>;
};

// 2FA step: 6-digit code (auto-submits when complete) and a resend link with cooldown
export const TwoFactorForm = (): JSX.Element => {
  const { method, digits, error, isPending, resendIn, setDigits, submit, resend } = useTwoFactor();

  const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    submit();
  };

  return (
    <form onSubmit={onSubmit} noValidate aria-label="Verificación en dos pasos" className="flex flex-col gap-5">
      <OtpInput digits={digits} invalid={Boolean(error)} disabled={isPending} onChange={setDigits} onComplete={submit} />
      {error && (
        <p role="alert" className="-mt-2 text-xs text-destructive">
          {error}
        </p>
      )}

      <button type="submit" disabled={isPending} className="btn-brand h-11 w-full">
        <MorphIcon icon={isPending ? LoaderCircle : ShieldCheck} size={16} className={isPending ? 'animate-spin' : ''} />
        {isPending ? 'Verificando…' : 'Verificar'}
      </button>

      {method === 'email' && (
        <p className="text-center text-sm text-muted-foreground">
          ¿No te llegó?{' '}
          {resendIn > 0 ? (
            <span className="tabular-nums">Reenviar en {resendIn} s</span>
          ) : (
            <button type="button" onClick={resend} disabled={isPending} className="font-medium text-brand transition-colors hover:text-brand-solid-hover">
              <span className="link-underline">Reenviar código</span>
            </button>
          )}
        </p>
      )}
    </form>
  );
};
