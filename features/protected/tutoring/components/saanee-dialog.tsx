'use client';

import { useState, useTransition, type JSX } from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SelectField } from '@/features/protected/academic/components/academic-ui';
import { FormDialog } from '@/features/protected/academic/components/form-dialog';
import { runAcademicAction } from '@/features/protected/academic/hooks/use-academic-form';
import { useToday } from '@/features/protected/academic/hooks/use-today';
import { referSaaneeAction } from '../actions/refer-saanee';
import { updateSaaneeAction } from '../actions/update-saanee';
import { saaneeStatusLabels } from '../data/tutoring-data';
import type { SaaneeReferral } from '../types';

// Refers a student to the SAANEE of the jurisdiction (what was observed, the oficio) or follows a referral up
export const SaaneeDialog = ({ slug, student, referral, onClose, onSaved }: { slug: string; student: { id: string; name: string }; referral?: SaaneeReferral; onClose: () => void; onSaved: () => void }): JSX.Element => {
  const today = useToday();
  const [reason, setReason] = useState('');
  const [reference, setReference] = useState(referral?.reference ?? '');
  const [sentOn, setSentOn] = useState(today);
  const [status, setStatus] = useState(referral?.status ?? 'sent');
  const [response, setResponse] = useState(referral?.response ?? '');
  const [isPending, start] = useTransition();
  const short = !referral && reason.trim().length < 10;
  const submit = (): void =>
    start(async () => {
      const r = referral
        ? await runAcademicAction(updateSaaneeAction(slug, { id: referral.id, status, reference: reference.trim(), response: response.trim() }))
        : await runAcademicAction(referSaaneeAction(slug, { studentId: student.id, reason: reason.trim(), reference: reference.trim(), sentOn }));
      if (r.ok) onSaved();
    });
  return (
    <FormDialog
      title={referral ? `SAANEE · ${student.name}` : `Derivar al SAANEE · ${student.name}`}
      description={referral ? referral.reason : 'El Servicio de Apoyo y Asesoramiento para la Atención de las Necesidades Educativas Especiales de la jurisdicción evalúa y orienta los apoyos que el estudiante necesita.'}
      submitLabel={referral ? 'Guardar' : 'Registrar derivación'}
      isPending={isPending}
      disabled={short}
      onSubmit={submit}
      onClose={onClose}
    >
      {!referral && (
        <FormField id="saanee-reason" label="Lo observado" required error={short && reason ? 'Describe con más detalle (10 caracteres o más).' : undefined}>
          <Textarea id="saanee-reason" rows={4} maxLength={2000} value={reason} onChange={(e): void => setReason(e.target.value)} />
        </FormField>
      )}
      {referral && (
        <FormField id="saanee-status" label="Estado">
          <SelectField id="saanee-status" value={status} options={Object.entries(saaneeStatusLabels).map(([value, label]) => ({ value, label }))} onChange={setStatus} />
        </FormField>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="saanee-reference" label="Oficio o expediente">
          <Input id="saanee-reference" maxLength={120} placeholder="Oficio N.° …" value={reference} onChange={(e): void => setReference(e.target.value)} />
        </FormField>
        {!referral && (
          <FormField id="saanee-sent" label="Enviada el">
            <Input id="saanee-sent" type="date" max={today} value={sentOn} onChange={(e): void => setSentOn(e.target.value)} />
          </FormField>
        )}
      </div>
      {referral && (
        <FormField id="saanee-response" label="Respuesta o recomendaciones del SAANEE">
          <Textarea id="saanee-response" rows={3} maxLength={2000} value={response} onChange={(e): void => setResponse(e.target.value)} />
        </FormField>
      )}
    </FormDialog>
  );
};
