'use client';

import { useCallback, useState, useTransition } from 'react';
import { sileo } from 'sileo';
import { forgotPasswordAction } from '../actions/auth-actions';
import { EMAIL_PATTERN } from '../data/auth-data';
import type { UseForgotPasswordResult } from '../types';
import { useCaptcha } from './use-captcha';

// Requests a reset link; the confirmation never says whether the email has an account
export const useForgotPassword = (): UseForgotPasswordResult => {
  const [email, setEmailState] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [captchaError, setCaptchaError] = useState<string | undefined>();
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const clearCaptchaError = useCallback((): void => setCaptchaError(undefined), []);
  const { turnstileRef, captchaToken, setCaptchaToken, consume } = useCaptcha(clearCaptchaError);

  const setEmail = useCallback((value: string): void => {
    setEmailState(value);
    setError(undefined);
  }, []);

  const submit = useCallback((): void => {
    const nextError = EMAIL_PATTERN.test(email.trim()) ? undefined : 'Ingresa un correo válido.';
    const nextCaptcha = captchaToken ? undefined : 'Completa la verificación de seguridad.';
    setError(nextError);
    setCaptchaError(nextCaptcha);
    if (nextError || nextCaptcha) {
      sileo.warning({ title: 'Revisa el formulario', description: nextError ?? nextCaptcha });
      return;
    }

    startTransition(async (): Promise<void> => {
      const normalized = email.trim().toLowerCase();
      const result = await forgotPasswordAction({ email: normalized, captchaToken: consume() });
      if (!result.ok) {
        sileo.error({ title: 'No pudimos enviar el enlace', description: result.message });
        return;
      }
      setSentTo(normalized);
    });
  }, [email, captchaToken, consume]);

  const reset = useCallback((): void => {
    setSentTo(null);
    setEmailState('');
  }, []);

  return { email, error, captchaError, isPending, sentTo, turnstileRef, setCaptchaToken, setEmail, submit, reset };
};
