'use client';

import { useCallback, useState, useTransition } from 'react';
import { sileo } from 'sileo';
import { updateAccountContactAction } from '../actions/account-actions';
import type { AccountContact, UseUpdateAccountContactResult } from '../types';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Edit-in-place of the person's own contact data: email, phone and address
export const useUpdateAccountContact = (contact: AccountContact, onSaved: (contact: AccountContact) => void): UseUpdateAccountContactResult => {
  const [values, setValues] = useState<AccountContact>(contact);
  const [errors, setErrors] = useState<UseUpdateAccountContactResult['errors']>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const setField = useCallback((field: keyof AccountContact, value: string): void => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }, []);

  const startEditing = useCallback((): void => {
    setValues(contact);
    setIsEditing(true);
  }, [contact]);

  const cancel = useCallback((): void => {
    setValues(contact);
    setErrors({});
    setIsEditing(false);
  }, [contact]);

  const submit = useCallback((): void => {
    const next: UseUpdateAccountContactResult['errors'] = {};
    if (!EMAIL_PATTERN.test(values.email.trim())) next.email = 'Ingresa un correo válido.';
    if (values.phone.replace(/\D/g, '').length < 9) next.phone = 'Ingresa un teléfono de al menos 9 dígitos.';
    if (values.address.trim().length < 5) next.address = 'Ingresa tu dirección.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    startTransition(async (): Promise<void> => {
      const result = await updateAccountContactAction(values);
      if (!result.ok || !result.data) {
        sileo.error({ title: 'No se guardaron tus datos', description: result.message });
        return;
      }
      onSaved(result.data);
      setIsEditing(false);
      sileo.success({ title: 'Datos actualizados', description: 'Secretaría verá tus nuevos datos de contacto.' });
    });
  }, [values, onSaved]);

  return { values, errors, isEditing, isPending, setField, startEditing, cancel, submit };
};
