'use client';

import type { FormEvent, JSX } from 'react';
import { KeyRound, LoaderCircle } from 'lucide';
import { FormField } from '@/components/ui/form-field';
import { MorphIcon } from '@/components/ui/morph-icon';
import { useChangePassword } from '../hooks/use-change-password';
import type { ChangePasswordValues } from '../types';
import { PasswordChecklist } from './password-checklist';
import { PasswordInput } from './password-input';

const controlClassName = 'h-11 w-full rounded-lg bg-background';

// Current password + new one with the live requirements checklist
export const ChangePasswordForm = (): JSX.Element => {
  const { values, errors, isPending, setField, submit } = useChangePassword();

  const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    submit();
  };

  // aria wiring shared by every control that can show an error
  const describe = (field: keyof ChangePasswordValues): { 'aria-invalid': boolean; 'aria-describedby'?: string } => ({ 'aria-invalid': Boolean(errors[field]), 'aria-describedby': errors[field] ? `change-${field}-error` : undefined });

  return (
    <form onSubmit={onSubmit} noValidate aria-label="Cambiar contraseña" className="flex flex-col gap-5">
      <FormField id="change-current" label="Contraseña actual" error={errors.current}>
        <PasswordInput id="change-current" autoComplete="current-password" placeholder="Tu contraseña actual o temporal" value={values.current} onChange={(event): void => setField('current', event.target.value)} className={controlClassName} {...describe('current')} />
      </FormField>

      <div className="flex flex-col gap-3">
        <FormField id="change-password" label="Nueva contraseña" error={errors.password}>
          <PasswordInput id="change-password" autoComplete="new-password" placeholder="Crea una contraseña" value={values.password} onChange={(event): void => setField('password', event.target.value)} className={controlClassName} {...describe('password')} />
        </FormField>
        <PasswordChecklist password={values.password} />
      </div>

      <FormField id="change-confirm" label="Confirmar contraseña" error={errors.confirm}>
        <PasswordInput id="change-confirm" autoComplete="new-password" placeholder="Repite la contraseña" value={values.confirm} onChange={(event): void => setField('confirm', event.target.value)} className={controlClassName} {...describe('confirm')} />
      </FormField>

      <button type="submit" disabled={isPending} className="btn-brand mt-1 h-11 w-full">
        <MorphIcon icon={isPending ? LoaderCircle : KeyRound} size={16} className={isPending ? 'animate-spin' : ''} />
        {isPending ? 'Guardando…' : 'Cambiar contraseña'}
      </button>
    </form>
  );
};
