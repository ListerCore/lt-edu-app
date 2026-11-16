'use client';

import type { JSX } from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { controlClassName } from '@/features/protected/academic/components/academic-ui';
import { FormDialog } from '@/features/protected/academic/components/form-dialog';
import { useSaveRule } from '../hooks/use-save-rule';
import type { RuleDialogProps } from '../types';

// The CEBA's rule of permanence in the distance form and the thresholds of the dropout alerts
export const RuleDialog = ({ rule, onClose, onSaved }: RuleDialogProps): JSX.Element => {
  const { values, errors, isPending, setField, submit } = useSaveRule(rule, (): void => {
    onSaved();
    onClose();
  });
  const field = (id: keyof typeof values, label: string, hint: string, min: number, max: number): JSX.Element => (
    <FormField id={`rule-${id}`} label={label} required error={errors[id]} hint={hint}>
      <Input id={`rule-${id}`} type="number" min={min} max={max} value={values[id]} onChange={(e): void => setField(id, e.target.value)} className={controlClassName} />
    </FormField>
  );
  return (
    <FormDialog title="Regla de permanencia" description="Cómo se mide la permanencia en la forma a distancia y cuándo salta una alerta de abandono. Vale para todas las secciones a distancia del CEBA." submitLabel="Guardar regla" isPending={isPending} onSubmit={submit} onClose={onClose}>
      <div className="grid gap-5 sm:grid-cols-2">
        {field('minActiveDays', 'Días con actividad', 'Mínimo de días con alguna acción en la plataforma…', 1, 31)}
        {field('windowDays', '…en cada periodo de (días)', '7 para medir por semana.', 1, 31)}
        {field('inactiveDays', 'Alerta tras días sin conexión', 'Entre 3 y 90.', 3, 90)}
        {field('lowPercent', 'Alerta con permanencia bajo (%)', 'Entre 1 y 100.', 1, 100)}
      </div>
    </FormDialog>
  );
};
