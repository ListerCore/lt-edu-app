'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState, useTransition } from 'react';
import { sileo } from 'sileo';
import { resendTwoFactorAction, verifyTwoFactorAction } from '../actions/auth-actions';
import { AFTER_AUTH_PATH, OTP_LENGTH, RESEND_SECONDS } from '../data/auth-data';
import type { TwoFactorMethod, UseTwoFactorResult } from '../types';
import { startSession } from './use-session';

const emptyDigits = (): string[] => Array.from({ length: OTP_LENGTH }, () => '');

// Second factor: a 6-digit code sent by email (with a resend cooldown) or from the authenticator app
export const useTwoFactor = (): UseTwoFactorResult => {
  const router = useRouter();
  const method: TwoFactorMethod = useSearchParams().get('method') === 'totp' ? 'totp' : 'email';
  const [digits, setDigitsState] = useState<string[]>(emptyDigits);
  const [error, setError] = useState<string | undefined>();
  const [resendIn, setResendIn] = useState(RESEND_SECONDS);
  const [isPending, startTransition] = useTransition();

  // One tick per second while the cooldown runs
  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = window.setTimeout(() => setResendIn((current) => current - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [resendIn]);

  const setDigits = useCallback((next: string[]): void => {
    setDigitsState(next);
    setError(undefined);
  }, []);

  const submit = useCallback((): void => {
    const code = digits.join('');
    if (code.length !== OTP_LENGTH) {
      setError(`Ingresa los ${OTP_LENGTH} dígitos del código.`);
      return;
    }

    startTransition(async (): Promise<void> => {
      const result = await verifyTwoFactorAction({ code });
      if (!result.ok) {
        setDigitsState(emptyDigits());
        if (result.code === 'expired_challenge') {
          sileo.error({ title: 'La verificación venció', description: result.message });
          router.push('/auth/signin');
          return;
        }
        setError(result.message);
        sileo.error({ title: 'Código incorrecto', description: result.message });
        return;
      }
      startSession();
      sileo.success({ title: 'Bienvenido', description: 'Ingresaste correctamente.' });
      router.push(AFTER_AUTH_PATH);
    });
  }, [digits, router]);

  const resend = useCallback((): void => {
    if (resendIn > 0) return;
    startTransition(async (): Promise<void> => {
      const result = await resendTwoFactorAction();
      if (!result.ok) {
        if (result.code === 'expired_challenge') {
          sileo.error({ title: 'La verificación venció', description: result.message });
          router.push('/auth/signin');
          return;
        }
        sileo.error({ title: 'No se reenvió el código', description: result.message });
        return;
      }
      setDigitsState(emptyDigits());
      setResendIn(RESEND_SECONDS);
      sileo.info({ title: 'Código reenviado', description: result.message });
    });
  }, [resendIn, router]);

  return { method, digits, error, isPending, resendIn, setDigits, submit, resend };
};
