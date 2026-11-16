'use client';

import type { JSX } from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { controlClassName } from '@/features/protected/academic/components/academic-ui';
import { FormDialog } from '@/features/protected/academic/components/form-dialog';
import { useSetExtension } from '../hooks/use-set-extension';
import type { ExtensionDialogProps } from '../types';

// More time for one student; an empty date removes the extension
export const ExtensionDialog = ({ itemId, row, onClose, onSaved }: ExtensionDialogProps): JSX.Element => {
  const { values, errors, isPending, setField, submit } = useSetExtension({
    itemId,
    row,
    onSaved: (): void => {
      onSaved();
      onClose();
    },
  });
  return (
    <FormDialog title={`Prórroga · ${row.studentName}`} description="Hasta cuándo puede entregar este estudiante. Déjalo vacío para quitar la prórroga." submitLabel="Guardar" isPending={isPending} onSubmit={submit} onClose={onClose}>
      <FormField id="ext-until" label="Puede entregar hasta (Lima)" error={errors.closesAt}>
        <Input id="ext-until" type="datetime-local" value={values.closesAt} onChange={(e): void => setField('closesAt', e.target.value)} aria-invalid={Boolean(errors.closesAt)} className={controlClassName} />
      </FormField>
      <FormField id="ext-reason" label="Motivo" error={errors.reason}>
        <Input id="ext-reason" placeholder="Ej.: trabaja de noche esta semana" value={values.reason} maxLength={300} onChange={(e): void => setField('reason', e.target.value)} className={controlClassName} />
      </FormField>
    </FormDialog>
  );
};
