'use client';

import { useState, type JSX } from 'react';
import { FormField } from '@/components/ui/form-field';
import { Textarea } from '@/components/ui/textarea';
import { FormDialog } from '@/features/protected/academic/components/form-dialog';
import { useSetSiagie } from '../hooks/use-set-siagie';
import type { ObserveDialogProps } from '../types';

// Marks enrollments as observed in the SIAGIE with what the UGEL or the SIAGIE said, so secretaría fixes it
export const ObserveDialog = ({ slug, enrollmentIds, onClose, onSaved }: ObserveDialogProps): JSX.Element => {
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const { set, isSetting } = useSetSiagie(slug, onSaved);
  const submit = (): void => {
    if (!note.trim()) {
      setError('Escribe la observación.');
      return;
    }
    void set(enrollmentIds, 'observed', note).then((ok): void => {
      if (ok) onClose();
    });
  };
  return (
    <FormDialog title={`Observar ${enrollmentIds.length === 1 ? 'una matrícula' : `${enrollmentIds.length} matrículas`}`} description="Queda marcada hasta que la corrijas y vuelvas a exportarla." submitLabel="Marcar observada" isPending={isSetting} onSubmit={submit} onClose={onClose}>
      <FormField id="obs-note" label="Observación del SIAGIE o la UGEL" required error={error}>
        <Textarea id="obs-note" rows={3} maxLength={300} placeholder="Ej.: El DNI no coincide con RENIEC" value={note} onChange={(e): void => setNote(e.target.value)} className="rounded-lg bg-background" />
      </FormField>
    </FormDialog>
  );
};
