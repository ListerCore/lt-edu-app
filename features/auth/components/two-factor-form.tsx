'use client';

import type { FormEvent, JSX } from 'react';
import { KeyRound, LoaderCircle, ShieldCheck, Smartphone } from 'lucide';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { MorphIcon } from '@/components/ui/morph-icon';
import { useTwoFactor } from '../hooks/use-two-factor';
import { OtpInput } from './otp-input';

// Authenticator-app step: 6 digits (auto-submits when complete), or a recovery code if the phone is not at hand
export const TwoFactorForm = (): JSX.Element => {
  const { mode, digits, recoveryCode, error, isPending, setDigits, setRecoveryCode, toggleMode, submit } = useTwoFactor();

  const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    submit();
  };

  return (
    <form onSubmit={onSubmit} noValidate aria-label="Verificación en dos pasos" className="flex flex-col gap-5">
      {mode === 'app' ? (
        <OtpInput digits={digits} invalid={Boolean(error)} disabled={isPending} onChange={setDigits} onComplete={submit} />
      ) : (
        <FormField id="recovery-code" label="Código de respaldo" error={error}>
          <Input id="recovery-code" autoComplete="one-time-code" autoCapitalize="characters" spellCheck={false} placeholder="ABCDE-23456" value={recoveryCode} onChange={(event): void => setRecoveryCode(event.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? 'recovery-code-error' : undefined} className="h-11 w-full rounded-lg bg-background text-center font-mono tracking-widest" />
        </FormField>
      )}
      {mode === 'app' && error && (
        <p role="alert" className="-mt-2 text-xs text-destructive">
          {error}
        </p>
      )}

      <button type="submit" disabled={isPending} className="btn-brand h-11 w-full">
        <MorphIcon icon={isPending ? LoaderCircle : ShieldCheck} size={16} className={isPending ? 'animate-spin' : ''} />
        {isPending ? 'Verificando…' : 'Verificar'}
      </button>

      <button type="button" onClick={toggleMode} disabled={isPending} className="mx-auto inline-flex items-center gap-1.5 text-sm font-medium text-brand transition-colors hover:text-brand-solid-hover">
        <MorphIcon icon={mode === 'app' ? KeyRound : Smartphone} size={14} />
        <span className="link-underline">{mode === 'app' ? 'Usar un código de respaldo' : 'Usar el código de mi app'}</span>
      </button>
    </form>
  );
};
