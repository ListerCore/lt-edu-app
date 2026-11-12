'use client';

import type { JSX } from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { controlClassName } from '@/features/protected/academic/components/academic-ui';
import { FormDialog } from '@/features/protected/academic/components/form-dialog';
import { useCancelMeeting } from '../hooks/use-cancel-meeting';
import { useRecordMinutes } from '../hooks/use-record-minutes';
import { useRescheduleMeeting } from '../hooks/use-reschedule-meeting';
import type { MeetingActionDialogProps } from '../types';
import { ApafaNotifyToggle } from './apafa-notify-toggle';

const draftHint = 'La reunión aún no se convocó: las familias no tienen nada que saber todavía.';

// Moves the meeting to a new date; the families get a notice with the old and the new date
export const ApafaRescheduleDialog = ({ meeting, onClose, onDone }: MeetingActionDialogProps): JSX.Element => {
  const { values, errors, isPending, setField, submit } = useRescheduleMeeting(meeting.raw, onDone);
  return (
    <FormDialog title="Reprogramar la reunión" description={`Ahora: ${meeting.whenLabel}, ${meeting.timeLabel}.`} submitLabel={values.notify ? 'Reprogramar y avisar' : 'Reprogramar'} isPending={isPending} onSubmit={submit} onClose={onClose}>
      <FormField id="reschedule-when" label="Nueva fecha y hora" required error={errors.scheduled_at} hint="Hora de Lima.">
        <Input id="reschedule-when" type="datetime-local" value={values.scheduledAt} onChange={(e): void => setField('scheduledAt', e.target.value)} aria-invalid={Boolean(errors.scheduled_at)} className={controlClassName} />
      </FormField>
      <FormField id="reschedule-reason" label="Motivo" required error={errors.reason}>
        <Textarea id="reschedule-reason" rows={3} maxLength={300} value={values.reason} placeholder="Ej.: Coincide con el simulacro de sismo" onChange={(e): void => setField('reason', e.target.value)} aria-invalid={Boolean(errors.reason)} />
      </FormField>
      <ApafaNotifyToggle id="reschedule-notify" label="Avisar a las familias" hint={meeting.isDraft ? draftHint : 'Publica la nueva fecha y el motivo en Comunicados.'} checked={values.notify && !meeting.isDraft} disabled={isPending || meeting.isDraft} onChange={(next): void => setField('notify', next)} />
    </FormDialog>
  );
};

// Calls the meeting off with its reason
export const ApafaCancelDialog = ({ meeting, onClose, onDone }: MeetingActionDialogProps): JSX.Element => {
  const { values, errors, isPending, setField, submit } = useCancelMeeting(meeting.raw, onDone);
  return (
    <FormDialog title="Cancelar la reunión" description={`${meeting.title} · ${meeting.whenLabel}. La reunión queda en el historial como cancelada.`} submitLabel={values.notify ? 'Cancelar y avisar' : 'Cancelar reunión'} isPending={isPending} onSubmit={submit} onClose={onClose}>
      <FormField id="cancel-reason" label="Motivo" required error={errors.reason}>
        <Textarea id="cancel-reason" rows={3} maxLength={300} value={values.reason} placeholder="Ej.: Paro regional de transportistas" onChange={(e): void => setField('reason', e.target.value)} aria-invalid={Boolean(errors.reason)} />
      </FormField>
      <ApafaNotifyToggle id="cancel-notify" label="Avisar a las familias" hint={meeting.isDraft ? draftHint : 'Publica la cancelación y el motivo en Comunicados.'} checked={values.notify && !meeting.isDraft} disabled={isPending || meeting.isDraft} onChange={(next): void => setField('notify', next)} />
    </FormDialog>
  );
};

// "Marcar realizada": summary of the acta, agreements and attendees; publishing tells the families. Reopened to edit
export const ApafaMinutesDialog = ({ meeting, onClose, onDone }: MeetingActionDialogProps): JSX.Element => {
  const { values, errors, isPending, setField, submit } = useRecordMinutes(meeting.raw, onDone);
  const editing = meeting.status === 'held';
  return (
    <FormDialog wide title={editing ? 'Editar el acta' : 'Marcar como realizada'} description="Resume lo tratado y los acuerdos. El acta firmada y la lista de asistencia se adjuntan en Documentos." submitLabel={values.publish ? 'Guardar y publicar' : 'Guardar acta'} isPending={isPending} onSubmit={submit} onClose={onClose}>
      <FormField id="minutes-summary" label="Resumen del acta" required error={errors.minutes}>
        <Textarea id="minutes-summary" rows={5} maxLength={6000} value={values.minutes} placeholder="Con el quórum reglamentario se instaló la sesión…" onChange={(e): void => setField('minutes', e.target.value)} aria-invalid={Boolean(errors.minutes)} />
      </FormField>
      <FormField id="minutes-agreements" label="Acuerdos" error={errors.agreements} hint="Un acuerdo por línea.">
        <Textarea id="minutes-agreements" rows={4} maxLength={4000} value={values.agreements} placeholder={'1. Se aprueba el balance económico\n2. Faena de limpieza el sábado 30'} onChange={(e): void => setField('agreements', e.target.value)} aria-invalid={Boolean(errors.agreements)} />
      </FormField>
      <FormField id="minutes-attendees" label="Asistentes" error={errors.attendees} hint="Número de padres y madres que firmaron la asistencia.">
        <Input id="minutes-attendees" inputMode="numeric" value={values.attendees} maxLength={5} onChange={(e): void => setField('attendees', e.target.value.replace(/\D/g, ''))} aria-invalid={Boolean(errors.attendees)} className={`${controlClassName} sm:w-40`} />
      </FormField>
      <ApafaNotifyToggle id="minutes-publish" label={meeting.minutesPublished ? 'Avisar que el acta cambió' : 'Publicar el acta a las familias'} hint="Publica el resumen y los acuerdos en Comunicados." checked={values.publish} disabled={isPending} onChange={(next): void => setField('publish', next)} />
    </FormDialog>
  );
};
