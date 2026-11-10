'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState, useTransition } from 'react';
import { sileo } from 'sileo';
import { passwordSetupAction } from '../actions/auth-actions';
import { isStrongPassword } from '../data/auth-data';
import type { FieldErrors, UsePasswordSetupResult } from '../types';

// New password from a reset or invitation link (?token=...); on success the visitor signs in again
export const usePasswordSetup = (): UsePasswordSetupResult => {
  const router = useRouter();
  const token = useSearchParams().get('token') ?? '';
  const [password, setPasswordState] = useState('');
  const [confirm, setConfirmState] = useState('');
  const [errors, setErrors] = useState<FieldErrors<'password' | 'confirm'>>({});
  const [isPending, startTransition] = useTransition();

  const setPassword = useCallback((value: string): void => {
    setPasswordState(value);
    setErrors((current) => ({ ...current, password: undefined }));
  }, []);

  const setConfirm = useCallback((value: string): void => {
    setConfirmState(value);
    setErrors((current) => ({ ...current, confirm: undefined }));
  }, []);

  const submit = useCallback((): void => {
    const next: FieldErrors<'password' | 'confirm'> = {};
    if (!isStrongPassword(password)) next.password = 'La contraseña no cumple los requisitos.';
    if (confirm !== password) next.confirm = 'Las contraseñas no coinciden.';
    setErrors(next);
    if (Object.keys(next).length > 0) {
      sileo.warning({ title: 'Revisa el formulario', description: 'Hay campos sin completar o con errores.' });
      return;
    }

    startTransition(async (): Promise<void> => {
      const result = await passwordSetupAction({ token, password });
      if (!result.ok) {
        sileo.error({ title: 'No se guardó la contraseña', description: result.message });
        if (result.code === 'expired_link') router.push('/auth/recovery-account');
        return;
      }
      sileo.success({ title: 'Contraseña guardada', description: 'Ingresa con tu nueva contraseña.' });
      router.push('/auth/signin');
    });
  }, [password, confirm, token, router]);

  return { password, confirm, errors, isPending, setPassword, setConfirm, submit };
};
