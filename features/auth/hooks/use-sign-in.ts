'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState, useTransition } from 'react';
import { sileo } from 'sileo';
import { signInAction } from '../actions/auth-actions';
import { EMAIL_PATTERN } from '../data/auth-data';
import type { FieldErrors, SignInValues, UseSignInResult } from '../types';
import { useCaptcha } from './use-captcha';

// Email + password sign-in; a valid answer continues to the 2FA step with the email in the query
export const useSignIn = (): UseSignInResult => {
  const router = useRouter();
  const [values, setValues] = useState<SignInValues>({ email: '', password: '' });
  const [errors, setErrors] = useState<FieldErrors<keyof SignInValues>>({});
  const [isPending, startTransition] = useTransition();
  const clearCaptchaError = useCallback((): void => setErrors((current) => ({ ...current, captcha: undefined })), []);
  const { turnstileRef, captchaToken, setCaptchaToken, consume } = useCaptcha(clearCaptchaError);

  const setField = useCallback((field: keyof SignInValues, value: string): void => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }, []);

  const submit = useCallback((): void => {
    const next: FieldErrors<keyof SignInValues> = {};
    if (!EMAIL_PATTERN.test(values.email.trim())) next.email = 'Ingresa un correo válido.';
    if (values.password.length === 0) next.password = 'Ingresa tu contraseña.';
    if (!captchaToken) next.captcha = 'Completa la verificación de seguridad.';
    setErrors(next);
    if (Object.keys(next).length > 0) {
      sileo.warning({ title: 'Revisa el formulario', description: next.captcha && !next.email && !next.password ? 'Confirma que no eres un robot antes de ingresar.' : 'Hay campos sin completar o con errores.' });
      return;
    }

    startTransition(async (): Promise<void> => {
      const email = values.email.trim().toLowerCase();
      const result = await signInAction({ email, password: values.password, captchaToken: consume() });
      if (!result.ok) {
        if (result.code === 'invalid_credentials') setValues((current) => ({ ...current, password: '' }));
        sileo.error({ title: 'No pudimos iniciar sesión', description: result.message });
        return;
      }
      router.push(`/auth/two-factor?email=${encodeURIComponent(email)}`);
    });
  }, [values, captchaToken, consume, router]);

  return { values, errors, isPending, turnstileRef, setCaptchaToken, setField, submit };
};
