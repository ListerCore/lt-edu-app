'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState, useTransition } from 'react';
import { sileo } from 'sileo';
import { changePasswordAction } from '../actions/auth-actions';
import { AFTER_AUTH_PATH, isStrongPassword } from '../data/auth-data';
import type { ChangePasswordValues, FieldErrors, UseChangePasswordResult } from '../types';

// Changes the password of a signed-in user (also the forced change after a temporary password)
export const useChangePassword = (): UseChangePasswordResult => {
  const router = useRouter();
  const [values, setValues] = useState<ChangePasswordValues>({ current: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<FieldErrors<keyof ChangePasswordValues>>({});
  const [isPending, startTransition] = useTransition();

  const setField = useCallback((field: keyof ChangePasswordValues, value: string): void => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }, []);

  const submit = useCallback((): void => {
    const next: FieldErrors<keyof ChangePasswordValues> = {};
    if (values.current.length === 0) next.current = 'Ingresa tu contraseña actual.';
    if (!isStrongPassword(values.password)) next.password = 'La contraseña no cumple los requisitos.';
    else if (values.password === values.current) next.password = 'La nueva contraseña debe ser distinta a la actual.';
    if (values.confirm !== values.password) next.confirm = 'Las contraseñas no coinciden.';
    setErrors(next);
    if (Object.keys(next).length > 0) {
      sileo.warning({ title: 'Revisa el formulario', description: 'Hay campos sin completar o con errores.' });
      return;
    }

    startTransition(async (): Promise<void> => {
      const result = await changePasswordAction({ currentPassword: values.current, password: values.password });
      if (!result.ok) {
        if (result.code === 'invalid_credentials') {
          setErrors({ current: result.message });
          setValues((current) => ({ ...current, current: '' }));
        }
        sileo.error({ title: 'No se cambió la contraseña', description: result.message });
        return;
      }
      sileo.success({ title: 'Contraseña actualizada', description: 'Usa la nueva contraseña la próxima vez que ingreses.' });
      router.push(AFTER_AUTH_PATH);
    });
  }, [values, router]);

  return { values, errors, isPending, setField, submit };
};
