'use client';

import type { FormEvent, JSX } from 'react';
import { KeyRound, LoaderCircle } from 'lucide';
import { FormField } from '@/components/layout/form-field';
import { MorphIcon } from '@/components/ui/morph-icon';
import { usePasswordSetup } from '../hooks/use-password-setup';
import { PasswordChecklist } from './password-checklist';
import { PasswordInput } from './password-input';

const controlClassName = 'h-11 w-full rounded-lg bg-background';

// New password for reset and invitation links, with the live requirements checklist
export const PasswordSetupForm = (): JSX.Element => {
  const { password, confirm, errors, isPending, setPassword, setConfirm, submit } = usePasswordSetup();

  const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    submit();
  };

  return (
    <form onSubmit={onSubmit} noValidate aria-label="Crear nueva contraseña" className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <FormField id="setup-password" label="Nueva contraseña" error={errors.password}>
          <PasswordInput id="setup-password" autoComplete="new-password" placeholder="Crea una contraseña" value={password} onChange={(event): void => setPassword(event.target.value)} aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? 'setup-password-error' : undefined} className={controlClassName} />
        </FormField>
        <PasswordChecklist password={password} />
      </div>

      <FormField id="setup-confirm" label="Confirmar contraseña" error={errors.confirm}>
        <PasswordInput id="setup-confirm" autoComplete="new-password" placeholder="Repite la contraseña" value={confirm} onChange={(event): void => setConfirm(event.target.value)} aria-invalid={Boolean(errors.confirm)} aria-describedby={errors.confirm ? 'setup-confirm-error' : undefined} className={controlClassName} />
      </FormField>

      <button type="submit" disabled={isPending} className="btn-brand mt-1 h-11 w-full">
        <MorphIcon icon={isPending ? LoaderCircle : KeyRound} size={16} className={isPending ? 'animate-spin' : ''} />
        {isPending ? 'Guardando…' : 'Guardar contraseña'}
      </button>
    </form>
  );
};
