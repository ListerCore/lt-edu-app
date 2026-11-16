'use client';

import type { JSX } from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { controlClassName } from '@/features/protected/academic/components/academic-ui';
import { FormDialog } from '@/features/protected/academic/components/form-dialog';
import { useSaveUnit } from '../hooks/use-save-unit';
import type { UnitDialogProps } from '../types';

// Create or edit a unit: what it is about, when it opens to students and whether it is published
export const UnitDialog = ({ roomId, unit, onClose, onSaved }: UnitDialogProps): JSX.Element => {
  const { values, errors, isPending, setField, submit } = useSaveUnit({
    roomId,
    unit,
    onSaved: (): void => {
      onSaved();
      onClose();
    },
  });
  return (
    <FormDialog title={unit ? 'Editar unidad' : 'Nueva unidad'} description="Una unidad o semana del periodo promocional, con su material." submitLabel={unit ? 'Guardar' : 'Crear unidad'} isPending={isPending} onSubmit={submit} onClose={onClose}>
      <FormField id="unit-title" label="Título" required error={errors.title}>
        <Input id="unit-title" placeholder="Ej.: Unidad 1 · Leemos textos de nuestra comunidad" value={values.title} maxLength={160} onChange={(e): void => setField('title', e.target.value)} aria-invalid={Boolean(errors.title)} className={controlClassName} />
      </FormField>
      <FormField id="unit-summary" label="De qué trata" error={errors.summary}>
        <Textarea id="unit-summary" rows={3} value={values.summary} maxLength={2000} onChange={(e): void => setField('summary', e.target.value)} aria-invalid={Boolean(errors.summary)} />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="unit-opens" label="Se abre el" error={errors.opensOn} hint="Vacío: en cuanto la publiques.">
          <Input id="unit-opens" type="date" value={values.opensOn} onChange={(e): void => setField('opensOn', e.target.value)} aria-invalid={Boolean(errors.opensOn)} className={controlClassName} />
        </FormField>
        <label className="flex items-center justify-between gap-3 self-end rounded-lg border border-border px-3 py-2.5 text-sm">
          <span>
            <span className="block font-medium text-foreground">Publicada</span>
            <span className="text-xs text-muted-foreground">Visible para los estudiantes</span>
          </span>
          <Switch checked={values.published} onCheckedChange={(next): void => setField('published', next)} />
        </label>
      </div>
    </FormDialog>
  );
};
