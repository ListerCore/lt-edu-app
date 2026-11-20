'use client';

import type { FormEvent, JSX } from 'react';
import { KeyRound, LoaderCircle, MailCheck, RefreshCw, ShieldCheck, ShieldOff, Smartphone } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { CopyButton } from '@/components/ui/copy-button';
import { OtpInput } from '@/features/auth/components/otp-input';
import { maskEmail } from '@/features/auth/data/auth-data';
import { formatDate, mfaPurposeCopy } from '../data/account-data';
import { useTwoFactorSettings } from '../hooks/use-two-factor-settings';
import type { TwoFactorCardProps } from '../types';
import { RecoveryCodesSheet } from './recovery-codes-sheet';
import { UsedRecoveryCodes } from './used-recovery-codes';

// Two-step verification with an authenticator app (Google Authenticator or any TOTP app). Off: the password alone
// signs in. On: sign-in also asks the app's code. Every change here is confirmed with a code mailed to the account
export const TwoFactorCard = ({ status, email, onChanged }: TwoFactorCardProps): JSX.Element => {
  const flow = useTwoFactorSettings(onChanged);
  const { step, purpose, setup, isPending, error } = flow;

  const onEmailSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    flow.submitEmailCode();
  };
  const onAppSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    flow.submitAppCode();
  };

  return (
    <section aria-labelledby="account-two-factor" className="rounded-2xl border border-border bg-background p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h2 id="account-two-factor" className="flex items-center gap-2.5 text-base font-semibold text-foreground">
          <span className={status.enabled ? 'flex size-8 items-center justify-center rounded-lg bg-success/12 text-success' : 'flex size-8 items-center justify-center rounded-lg bg-brand-soft text-brand'}>
            <MorphIcon icon={status.enabled ? ShieldCheck : ShieldOff} size={16} />
          </span>
          Verificación en dos pasos
        </h2>
        <span className={status.enabled ? 'pill bg-success/12 text-success' : 'pill bg-surface text-muted-foreground'}>{status.enabled ? 'Activa' : 'Inactiva'}</span>
      </div>

      {step === 'idle' && (
        <div className="mt-4 space-y-5">
          <p className="text-sm leading-6 text-muted-foreground">
            {status.enabled
              ? `Activa desde el ${status.enabledAt ? formatDate(status.enabledAt) : '—'}. Al ingresar te pedimos el código de tu app autenticadora además de tu contraseña.`
              : 'Protege tu cuenta con una app autenticadora como Google Authenticator: al ingresar te pediremos su código además de tu contraseña.'}
          </p>
          {status.enabled && <UsedRecoveryCodes status={status} />}
          <div className="flex flex-wrap gap-2">
            {status.enabled ? (
              <>
                <button type="button" onClick={(): void => flow.start('mfa_recovery_codes')} disabled={isPending} className="btn-alt">
                  <MorphIcon icon={isPending ? LoaderCircle : RefreshCw} size={16} className={isPending ? 'animate-spin' : ''} />
                  Generar nuevos códigos
                </button>
                <button type="button" onClick={(): void => flow.start('mfa_disable')} disabled={isPending} className="btn-alt text-destructive">
                  <MorphIcon icon={ShieldOff} size={16} />
                  Desactivar
                </button>
              </>
            ) : (
              <button type="button" onClick={(): void => flow.start('mfa_enable')} disabled={isPending} className="btn-brand">
                <MorphIcon icon={isPending ? LoaderCircle : ShieldCheck} size={16} className={isPending ? 'animate-spin' : ''} />
                Activar
              </button>
            )}
          </div>
        </div>
      )}

      {step === 'email' && purpose && (
        <form onSubmit={onEmailSubmit} noValidate aria-label="Código enviado al correo" className="mt-5 space-y-5">
          <div className="flex items-start gap-3 rounded-xl bg-surface p-4 text-sm">
            <MorphIcon icon={MailCheck} size={18} className="mt-0.5 shrink-0 text-brand" />
            <p className="leading-6 text-muted-foreground">
              <span className="font-medium text-foreground">{mfaPurposeCopy[purpose].title}.</span> Para confirmar que eres tú, ingresa el código de 6 dígitos que enviamos a <span className="font-medium text-foreground">{maskEmail(flow.email || email)}</span>.
            </p>
          </div>
          <OtpInput digits={flow.digits} invalid={Boolean(error)} disabled={isPending} onChange={flow.setDigits} onComplete={flow.submitEmailCode} />
          {error && (
            <p role="alert" className="-mt-2 text-xs text-destructive">
              {error}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <button type="submit" disabled={isPending} className={purpose === 'mfa_disable' ? 'btn-alt text-destructive' : 'btn-brand'}>
              <MorphIcon icon={isPending ? LoaderCircle : ShieldCheck} size={16} className={isPending ? 'animate-spin' : ''} />
              {isPending ? 'Verificando…' : mfaPurposeCopy[purpose].action}
            </button>
            <button type="button" onClick={flow.cancel} disabled={isPending} className="btn-alt">
              Cancelar
            </button>
          </div>
          <p className="text-sm text-muted-foreground">
            ¿No te llegó?{' '}
            {flow.resendIn > 0 ? (
              <span className="tabular-nums">Reenviar en {flow.resendIn} s</span>
            ) : (
              <button type="button" onClick={flow.resend} disabled={isPending} className="font-medium text-brand transition-colors hover:text-brand-solid-hover">
                <span className="link-underline">Reenviar código</span>
              </button>
            )}
          </p>
        </form>
      )}

      {step === 'scan' && setup && (
        <form onSubmit={onAppSubmit} noValidate aria-label="Configurar la app autenticadora" className="mt-5 space-y-5">
          <ol className="space-y-1.5 text-sm leading-6 text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">1.</span> Abre Google Authenticator (o tu app autenticadora) y toca <span className="font-medium text-foreground">Agregar código</span>.
            </li>
            <li>
              <span className="font-medium text-foreground">2.</span> Escanea este código QR, o ingresa la clave a mano.
            </li>
            <li>
              <span className="font-medium text-foreground">3.</span> Escribe el código de 6 dígitos que muestra la app.
            </li>
          </ol>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            {/* eslint-disable-next-line @next/next/no-img-element -- data: URL generated by lt-edu-api */}
            <img src={setup.qrPng} alt="Código QR para tu app autenticadora" width={176} height={176} className="size-44 shrink-0 rounded-xl border border-border bg-white p-2" />
            <div className="w-full min-w-0 space-y-1.5">
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MorphIcon icon={KeyRound} size={12} />
                Clave para ingresarla a mano
              </p>
              <div className="flex items-center gap-1 rounded-lg border border-border bg-surface px-3 py-2">
                <code className="min-w-0 flex-1 font-mono text-sm break-all text-foreground">{setup.secret.match(/.{1,4}/g)?.join(' ')}</code>
                <CopyButton value={setup.secret} label="Clave" />
              </div>
            </div>
          </div>
          <OtpInput digits={flow.appDigits} invalid={Boolean(error)} disabled={isPending} onChange={flow.setAppDigits} onComplete={flow.submitAppCode} />
          {error && (
            <p role="alert" className="-mt-2 text-xs text-destructive">
              {error}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <button type="submit" disabled={isPending} className="btn-brand">
              <MorphIcon icon={isPending ? LoaderCircle : Smartphone} size={16} className={isPending ? 'animate-spin' : ''} />
              {isPending ? 'Verificando…' : 'Activar'}
            </button>
            <button type="button" onClick={flow.cancel} disabled={isPending} className="btn-alt">
              Cancelar
            </button>
          </div>
        </form>
      )}

      {step === 'codes' && flow.issuedAt && (
        <div className="mt-5 space-y-5">
          <p className="text-sm leading-6 text-muted-foreground">
            Guarda estos <span className="font-medium text-foreground">códigos de respaldo</span>. Cada uno sirve <span className="font-medium text-foreground">una sola vez</span> para ingresar si pierdes o no tienes a mano tu teléfono. No los volveremos a mostrar.
          </p>
          <RecoveryCodesSheet codes={flow.codes} email={flow.email || email} issuedAt={flow.issuedAt} />
          <button type="button" onClick={flow.finish} className="btn-brand w-full">
            <MorphIcon icon={ShieldCheck} size={16} />
            Ya guardé mis códigos
          </button>
        </div>
      )}
    </section>
  );
};
