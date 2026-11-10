'use client';

import { useCallback, useEffect, useState, useTransition } from 'react';
import { sileo } from 'sileo';
import { OTP_LENGTH } from '@/features/auth/data/auth-data';
import { beginTotpAction, confirmTotpAction, disableTotpAction, regenerateRecoveryCodesAction, sendTwoFactorCodeAction } from '../actions/account-actions';
import { MAIL_CODE_COOLDOWN } from '../data/account-data';
import type { MfaPurpose, TotpSetup, TwoFactorStep, UseTwoFactorSettingsResult } from '../types';

const emptyDigits = (): string[] => Array.from({ length: OTP_LENGTH }, () => '');

// Turning the authenticator app on or off, and renewing the recovery codes, all start with a code mailed to the
// account. Enabling then shows the QR and asks the app's first code; enabling and renewing end showing the codes
export const useTwoFactorSettings = (onChanged: () => void): UseTwoFactorSettingsResult => {
  const [step, setStep] = useState<TwoFactorStep>('idle');
  const [purpose, setPurpose] = useState<MfaPurpose | null>(null);
  const [challengeToken, setChallengeToken] = useState('');
  const [email, setEmail] = useState('');
  const [digits, setDigitsState] = useState<string[]>(emptyDigits);
  const [appDigits, setAppDigitsState] = useState<string[]>(emptyDigits);
  const [setup, setSetup] = useState<TotpSetup | null>(null);
  const [codes, setCodes] = useState<string[]>([]);
  const [issuedAt, setIssuedAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | undefined>();
  const [resendIn, setResendIn] = useState(0);
  const [isPending, startTransition] = useTransition();

  // One tick per second while the resend cooldown runs
  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = window.setTimeout(() => setResendIn((current) => current - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [resendIn]);

  const reset = useCallback((): void => {
    setStep('idle');
    setPurpose(null);
    setChallengeToken('');
    setDigitsState(emptyDigits());
    setAppDigitsState(emptyDigits());
    setSetup(null);
    setCodes([]);
    setIssuedAt(null);
    setError(undefined);
  }, []);

  const mail = useCallback((next: MfaPurpose): void => {
    startTransition(async (): Promise<void> => {
      const result = await sendTwoFactorCodeAction(next);
      if (!result.ok || !result.data) {
        if (result.code === 'resend_too_soon') setResendIn(MAIL_CODE_COOLDOWN);
        sileo.error({ title: 'No enviamos el código', description: result.message });
        return;
      }
      setPurpose(next);
      setChallengeToken(result.data.challengeToken);
      setEmail(result.data.email);
      setDigitsState(emptyDigits());
      setError(undefined);
      setResendIn(MAIL_CODE_COOLDOWN);
      setStep('email');
      sileo.info({ title: 'Revisa tu correo', description: result.message });
    });
  }, []);

  const start = useCallback((next: MfaPurpose): void => mail(next), [mail]);

  const resend = useCallback((): void => {
    if (purpose && resendIn <= 0) mail(purpose);
  }, [mail, purpose, resendIn]);

  const setDigits = useCallback((next: string[]): void => {
    setDigitsState(next);
    setError(undefined);
  }, []);

  const setAppDigits = useCallback((next: string[]): void => {
    setAppDigitsState(next);
    setError(undefined);
  }, []);

  const showCodes = useCallback((next: string[]): void => {
    setCodes(next);
    setIssuedAt(new Date());
    setStep('codes');
  }, []);

  const submitEmailCode = useCallback((): void => {
    const code = digits.join('');
    if (code.length !== OTP_LENGTH || !purpose) {
      setError(`Ingresa los ${OTP_LENGTH} dígitos que enviamos a tu correo.`);
      return;
    }
    startTransition(async (): Promise<void> => {
      const fail = (message: string, expired: boolean): void => {
        setDigitsState(emptyDigits());
        setError(message);
        if (expired) {
          sileo.error({ title: 'El código venció', description: 'Pide uno nuevo para continuar.' });
          reset();
        }
      };
      if (purpose === 'mfa_enable') {
        const result = await beginTotpAction(challengeToken, code);
        if (!result.ok || !result.data) return fail(result.message, result.code === 'expired_challenge');
        setSetup(result.data);
        setError(undefined);
        setStep('scan');
        return;
      }
      if (purpose === 'mfa_disable') {
        const result = await disableTotpAction(challengeToken, code);
        if (!result.ok) return fail(result.message, result.code === 'expired_challenge');
        sileo.success({ title: 'Verificación desactivada', description: 'Desde ahora ingresas solo con tu contraseña.' });
        reset();
        onChanged();
        return;
      }
      const result = await regenerateRecoveryCodesAction(challengeToken, code);
      if (!result.ok || !result.data) return fail(result.message, result.code === 'expired_challenge');
      sileo.success({ title: 'Códigos nuevos', description: 'Los anteriores ya no funcionan.' });
      showCodes(result.data);
      onChanged();
    });
  }, [digits, purpose, challengeToken, reset, onChanged, showCodes]);

  const submitAppCode = useCallback((): void => {
    const code = appDigits.join('');
    if (code.length !== OTP_LENGTH) {
      setError(`Ingresa los ${OTP_LENGTH} dígitos que muestra tu app.`);
      return;
    }
    startTransition(async (): Promise<void> => {
      const result = await confirmTotpAction(code);
      if (!result.ok || !result.data) {
        setAppDigitsState(emptyDigits());
        setError(result.message);
        return;
      }
      sileo.success({ title: 'Verificación activada', description: 'Guarda tus códigos de respaldo antes de continuar.' });
      showCodes(result.data);
      onChanged();
    });
  }, [appDigits, onChanged, showCodes]);

  return { step, purpose, email, digits, appDigits, setup, codes, issuedAt, error, isPending, resendIn, start, resend, setDigits, setAppDigits, submitEmailCode, submitAppCode, finish: reset, cancel: reset };
};
