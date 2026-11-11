'use client';

import { useCallback, useState, useTransition } from 'react';
import { sileo } from 'sileo';
import type { AcademicResult, FormState } from '../types';

interface UseAcademicFormOptions<V, T> {
  initial: V;
  // Checks done before calling the API; return field errors to stop
  validate?: (values: V) => Record<string, string>;
  save: (values: V) => Promise<AcademicResult<T>>;
  onSaved: (data: T) => void;
  successTitle?: string;
}

// A dialog form: values, per-field errors (from the API too), pending state and a toast on success or failure
export const useAcademicForm = <V, T>({ initial, validate, save, onSaved, successTitle }: UseAcademicFormOptions<V, T>): FormState<V> => {
  const [values, setValues] = useState<V>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  const setField = useCallback(<K extends keyof V>(key: K, value: V[K]): void => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!(key as string in current)) return current;
      const next = { ...current };
      delete next[key as string];
      return next;
    });
  }, []);

  const submit = (): void => {
    const local = validate?.(values) ?? {};
    if (Object.keys(local).length > 0) {
      setErrors(local);
      return;
    }
    startTransition(async (): Promise<void> => {
      const result = await save(values);
      if (!result.ok) {
        setErrors(result.fields ?? {});
        sileo.error({ title: 'No se pudo guardar', description: result.message });
        return;
      }
      sileo.success({ title: successTitle ?? result.message ?? 'Listo' });
      onSaved(result.data);
    });
  };

  return { values, errors, isPending, setField, submit };
};

// Runs a one-off action (delete, change of status…) with a toast; resolves true when it worked
export const runAcademicAction = async <T>(action: Promise<AcademicResult<T>>, success?: string): Promise<AcademicResult<T>> => {
  const result = await action;
  if (result.ok) {
    if (success ?? result.message) sileo.success({ title: success ?? result.message ?? '' });
  } else sileo.error({ title: 'No se pudo completar', description: result.message });
  return result;
};
