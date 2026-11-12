'use client';

import type { JSX } from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { SelectField, controlClassName } from '@/features/protected/academic/components/academic-ui';
import { FormDialog } from '@/features/protected/academic/components/form-dialog';
import { items } from '@/features/protected/academic/data/academic-data';
import { positionLabels } from '../data/apafa-data';
import { useSaveBoardMember } from '../hooks/use-save-board-member';
import type { BoardDialogProps } from '../types';

// Add or edit one office of the APAFA board (consejo directivo)
export const ApafaBoardDialog = ({ member, onClose, onSaved }: BoardDialogProps): JSX.Element => {
  const { values, errors, isPending, setField, submit } = useSaveBoardMember({
    member,
    onSaved: (): void => {
      onSaved();
      onClose();
    },
  });
  return (
    <FormDialog title={member ? 'Editar cargo' : 'Agregar al consejo directivo'} description="Quién ocupa cada cargo de la APAFA y por qué periodo." submitLabel={member ? 'Guardar' : 'Agregar'} isPending={isPending} onSubmit={submit} onClose={onClose}>
      <FormField id="board-name" label="Nombre completo" required error={errors.full_name}>
        <Input id="board-name" value={values.fullName} maxLength={160} autoComplete="off" onChange={(e): void => setField('fullName', e.target.value)} aria-invalid={Boolean(errors.full_name)} className={controlClassName} />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="board-position" label="Cargo" required error={errors.position}>
          <SelectField id="board-position" value={values.position} options={items(positionLabels)} onChange={(v): void => setField('position', v)} invalid={Boolean(errors.position)} placeholder="Elige el cargo" />
        </FormField>
        <FormField id="board-phone" label="Celular" error={errors.phone} hint="Opcional, visible para el personal y las familias.">
          <Input id="board-phone" inputMode="tel" value={values.phone} maxLength={20} onChange={(e): void => setField('phone', e.target.value)} aria-invalid={Boolean(errors.phone)} className={controlClassName} />
        </FormField>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="board-from" label="Desde" required error={errors.starts_on}>
          <Input id="board-from" type="date" value={values.startsOn} onChange={(e): void => setField('startsOn', e.target.value)} aria-invalid={Boolean(errors.starts_on)} className={controlClassName} />
        </FormField>
        <FormField id="board-to" label="Hasta" required error={errors.ends_on}>
          <Input id="board-to" type="date" value={values.endsOn} min={values.startsOn || undefined} onChange={(e): void => setField('endsOn', e.target.value)} aria-invalid={Boolean(errors.ends_on)} className={controlClassName} />
        </FormField>
      </div>
    </FormDialog>
  );
};
