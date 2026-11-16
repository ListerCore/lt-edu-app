'use client';

import { useState, type JSX } from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { controlClassName } from '@/features/protected/academic/components/academic-ui';
import { FormDialog } from '@/features/protected/academic/components/form-dialog';
import { todayISO } from '@/features/protected/academic/data/academic-data';
import { useReligionExemption } from '../hooks/use-religion-exemption';
import type { ExemptionDialogProps } from '../types';

// Grants the exemption from Educación Religiosa (Ley 29635) with the date of the request and the resolution, or
// withdraws it when already granted
export const ExemptionDialog = ({ slug, row, onClose, onSaved }: ExemptionDialogProps): JSX.Element => {
  const [today] = useState(todayISO);
  const [requestedOn, setRequestedOn] = useState(today);
  const [reference, setReference] = useState('');
  const { save, isSaving } = useReligionExemption(slug, onSaved);
  const withdraw = row.religionExempt;
  const submit = (): void => {
    void save(row.enrollmentId, !withdraw, withdraw ? '' : requestedOn, reference).then((ok): void => {
      if (ok) onClose();
    });
  };
  return (
    <FormDialog
      title={withdraw ? 'Retirar la exoneración' : 'Exonerar de Educación Religiosa'}
      description={withdraw ? `${row.studentName} vuelve a cursar Educación Religiosa y a figurar en su registro.` : `${row.studentName} sale del registro de Educación Religiosa y su libreta dirá «Exonerado» (Ley 29635).`}
      submitLabel={withdraw ? 'Retirar' : 'Exonerar'}
      isPending={isSaving}
      onSubmit={submit}
      onClose={onClose}
    >
      {!withdraw && (
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="ex-date" label="Fecha de la solicitud" required>
            <Input id="ex-date" type="date" max={today} value={requestedOn} onChange={(e): void => setRequestedOn(e.target.value)} className={controlClassName} />
          </FormField>
          <FormField id="ex-reference" label="Resolución" hint="Resolución directoral que la concede.">
            <Input id="ex-reference" placeholder="Ej.: RD N.° 015-2026" value={reference} maxLength={120} onChange={(e): void => setReference(e.target.value)} className={controlClassName} />
          </FormField>
        </div>
      )}
    </FormDialog>
  );
};
