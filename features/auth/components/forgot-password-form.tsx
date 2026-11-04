'use client';

import Link from 'next/link';
import type { FormEvent, JSX } from 'react';
import { LoaderCircle, MailCheck, RotateCcw, Send } from 'lucide';
import { FormField } from '@/components/layout/form-field';
import { Input } from '@/components/ui/input';
import { MorphIcon } from '@/components/ui/morph-icon';
import { useForgotPassword } from '../hooks/use-forgot-password';
import { TurnstileField } from './turnstile-field';

// Reset request: email form, then a neutral confirmation (with the simulated link to keep the flow testable)
export const ForgotPasswordForm = (): JSX.Element => {
  const { email, error, captchaError, isPending, sentTo, turnstileRef, setCaptchaToken, setEmail, submit, reset } = useForgotPassword();

  if (sentTo) {
    return (
      <div role="status" className="flex flex-col items-center gap-5 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-success/12 text-success">
          <MorphIcon icon={MailCheck} size={28} />
        </span>
        <p className="text-sm leading-6 text-muted-foreground">
          Si <span className="font-medium text-foreground">{sentTo}</span> tiene una cuenta, recibirá un enlace para crear una nueva contraseña. Revisa también la carpeta de spam.
        </p>
        <Link href="/auth/set-password?token=simulado" className="btn-brand w-full">
          Abrir el enlace (simulado)
        </Link>
        <button type="button" onClick={reset} className="btn-alt w-full">
          <MorphIcon icon={RotateCcw} size={16} />
          Usar otro correo
        </button>
      </div>
    );
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    submit();
  };

  return (
    <form onSubmit={onSubmit} noValidate aria-label="Recuperar contraseña" className="flex flex-col gap-5">
      <FormField id="forgot-email" label="Correo" error={error}>
        <Input id="forgot-email" type="email" autoComplete="email" inputMode="email" placeholder="nombre@institucion.edu.pe" value={email} onChange={(event): void => setEmail(event.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? 'forgot-email-error' : undefined} className="h-11 w-full rounded-lg bg-background" />
      </FormField>

      <TurnstileField turnstileRef={turnstileRef} error={captchaError} onToken={setCaptchaToken} />

      <button type="submit" disabled={isPending} className="btn-brand mt-1 h-11 w-full">
        <MorphIcon icon={isPending ? LoaderCircle : Send} size={16} className={isPending ? 'animate-spin' : ''} />
        {isPending ? 'Enviando…' : 'Enviar enlace'}
      </button>
    </form>
  );
};
