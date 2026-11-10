'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState, useTransition } from 'react';
import { sileo } from 'sileo';
import { signUpAction } from '../actions/auth-actions';
import { EMAIL_PATTERN, isStrongPassword } from '../data/auth-data';
import type { FieldErrors, SignUpValues, UseSignUpResult } from '../types';
import { useCaptcha } from './use-captcha';

const initialValues: SignUpValues = { fullName: '', email: '', password: '', confirm: '', terms: false };

const clean = (value: string): string => value.trim().replace(/\s+/g, ' ');

// Field-level validation with the messages shown under each input
const validate = (values: SignUpValues): FieldErrors<keyof SignUpValues> => {
  const errors: FieldErrors<keyof SignUpValues> = {};
  if (clean(values.fullName).length < 3) errors.fullName = 'Ingresa tu nombre completo.';
  if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = 'Ingresa un correo válido.';
  if (!isStrongPassword(values.password)) errors.password = 'La contraseña no cumple los requisitos.';
  if (values.confirm !== values.password) errors.confirm = 'Las contraseñas no coinciden.';
  if (!values.terms) errors.terms = 'Debes aceptar los términos y la política de privacidad.';
  return errors;
};

// Creates a user account; joseph-api resolves the institution and role from the email the institution registered
export const useSignUp = (): UseSignUpResult => {
  const router = useRouter();
  const [values, setValues] = useState<SignUpValues>(initialValues);
  const [errors, setErrors] = useState<FieldErrors<keyof SignUpValues>>({});
  const [isPending, startTransition] = useTransition();
  const clearCaptchaError = useCallback((): void => setErrors((current) => ({ ...current, captcha: undefined })), []);
  const { turnstileRef, captchaToken, setCaptchaToken, consume } = useCaptcha(clearCaptchaError);

  const setField = useCallback(<K extends keyof SignUpValues>(field: K, value: SignUpValues[K]): void => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }, []);

  const submit = useCallback((): void => {
    const next = validate(values);
    if (!captchaToken) next.captcha = 'Completa la verificación de seguridad.';
    setErrors(next);
    if (Object.keys(next).length > 0) {
      sileo.warning({ title: 'Revisa el formulario', description: 'Hay campos sin completar o con errores.' });
      return;
    }

    startTransition(async (): Promise<void> => {
      const result = await signUpAction({
        nombre: clean(values.fullName),
        email: values.email.trim().toLowerCase(),
        password: values.password,
        captchaToken: consume(),
      });
      if (!result.ok) {
        if (result.code === 'email_taken' || result.code === 'not_invited') setErrors({ email: result.message });
        else if (result.fields) setErrors({ fullName: result.fields.full_name, email: result.fields.email, password: result.fields.password });
        sileo.error({ title: 'No se creó la cuenta', description: result.message });
        return;
      }
      sileo.success({ title: 'Cuenta creada', description: 'Ya puedes ingresar con tu correo y contraseña.' });
      router.push('/auth/signin');
    });
  }, [values, captchaToken, consume, router]);

  return { values, errors, isPending, turnstileRef, setCaptchaToken, setField, submit };
};
