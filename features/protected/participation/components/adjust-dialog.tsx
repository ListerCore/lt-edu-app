'use client';

import { useState, type JSX } from 'react';
import { FormField } from '@/components/ui/form-field';
import { Textarea } from '@/components/ui/textarea';
import { SelectField } from '@/features/protected/academic/components/academic-ui';
import { FormDialog } from '@/features/protected/academic/components/form-dialog';
import { shortDay } from '../data/participation-data';
import { useAdjustPermanence } from '../hooks/use-adjust-permanence';
import type { AdjustDialogProps } from '../types';

// The tutor decides one week: present (worked without leaving a trace: a call, work on paper) or absent, always
// with the reason, which goes to the audit; an adjusted week can go back to what the activity says
export const AdjustDialog = ({ target, onClose, onSaved }: AdjustDialogProps): JSX.Element => {
  const { student, window: w } = target;
  const [present, setPresent] = useState(w.adjusted ? w.present : !w.present);
  const [reason, setReason] = useState(w.adjusted ? w.reason : '');
  const [error, setError] = useState('');
  const { adjust, isAdjusting } = useAdjustPermanence(onSaved);
  const save = (clear: boolean): void => {
    if (!clear && !reason.trim()) {
      setError('Escribe la justificación.');
      return;
    }
    void adjust(student.enrollmentId, w.start, present, clear, reason).then((ok): void => {
      if (ok) onClose();
    });
  };
  return (
    <FormDialog
      title={`Semana del ${shortDay(w.start)} al ${shortDay(w.end)}`}
      description={`${student.studentName}: ${w.activeDays} ${w.activeDays === 1 ? 'día' : 'días'} con actividad en la plataforma. El ajuste queda en la auditoría con tu nombre.`}
      submitLabel="Guardar ajuste"
      isPending={isAdjusting}
      onSubmit={(): void => save(false)}
      onClose={onClose}
    >
      <FormField id="adj-present" label="La semana cuenta como" required>
        <SelectField id="adj-present" value={present ? 'yes' : 'no'} options={[{ value: 'yes', label: 'Presente' }, { value: 'no', label: 'Ausente' }]} onChange={(v): void => setPresent(v === 'yes')} />
      </FormField>
      <FormField id="adj-reason" label="Justificación" required error={error}>
        <Textarea id="adj-reason" rows={3} maxLength={300} placeholder="Ej.: entregó la actividad impresa; sin saldo de datos esa semana" value={reason} onChange={(e): void => setReason(e.target.value)} className="rounded-lg bg-background" />
      </FormField>
      {w.adjusted && (
        <button type="button" className="text-sm font-medium text-brand hover:underline" disabled={isAdjusting} onClick={(): void => save(true)}>
          Quitar el ajuste y volver a lo que registra la plataforma
        </button>
      )}
    </FormDialog>
  );
};
