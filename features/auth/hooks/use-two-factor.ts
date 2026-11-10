'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState, useTransition } from 'react';
import { sileo } from 'sileo';
import { verifyTwoFactorAction } from '../actions/auth-actions';
import { AFTER_AUTH_PATH, OTP_LENGTH } from '../data/auth-data';
import type { TwoFactorMode, UseTwoFactorResult } from '../types';
import { startSession } from './use-session';

const emptyDigits = (): string[] => Array.from({ length: OTP_LENGTH }, () => '');

// Recovery codes read ABCDE-23456; anything else in between is ignored
const RECOVERY_LENGTH = 10;

// Authenticator-app step: the 6 digits of the app, or a recovery code when the phone is not at hand
export const useTwoFactor = (): UseTwoFactorResult => {
  const router = useRouter();
  const [mode, setMode] = useState<TwoFactorMode>('app');
  const [digits, setDigitsState] = useState<string[]>(emptyDigits);
  const [recoveryCode, setRecoveryCodeState] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const setDigits = useCallback((next: string[]): void => {
    setDigitsState(next);
    setError(undefined);
  }, []);

  const setRecoveryCode = useCallback((value: string): void => {
    setRecoveryCodeState(value.toUpperCase());
    setError(undefined);
  }, []);

  const toggleMode = useCallback((): void => {
    setMode((current) => (current === 'app' ? 'recovery' : 'app'));
    setDigitsState(emptyDigits());
    setRecoveryCodeState('');
    setError(undefined);
  }, []);

  const submit = useCallback((): void => {
    const code = mode === 'app' ? digits.join('') : recoveryCode.trim();
    if (mode === 'app' && code.length !== OTP_LENGTH) {
      setError(`Ingresa los ${OTP_LENGTH} dígitos de tu app.`);
      return;
    }
    if (mode === 'recovery' && code.replace(/[^A-Z0-9]/gi, '').length !== RECOVERY_LENGTH) {
      setError('El código de respaldo tiene 10 caracteres, por ejemplo ABCDE-23456.');
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
  }, [mode, digits, recoveryCode, router]);

  return { mode, digits, recoveryCode, error, isPending, setDigits, setRecoveryCode, toggleMode, submit };
};
