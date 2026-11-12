'use client';

import type { JSX } from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SelectField, controlClassName } from '@/features/protected/academic/components/academic-ui';
import { FormDialog } from '@/features/protected/academic/components/form-dialog';
import { items } from '@/features/protected/academic/data/academic-data';
import { audienceLabels, kindLabels, modalityLabels } from '../data/apafa-data';
import { useSaveMeeting } from '../hooks/use-save-meeting';
import type { MeetingDialogProps } from '../types';
import { ApafaNotifyToggle } from './apafa-notify-toggle';

// Schedule a meeting or edit one still to be held. On create, "Convocar y notificar" publishes the convocatoria;
// once convened, the date moves only through "Reprogramar"
export const ApafaMeetingDialog = ({ meeting, onClose, onSaved }: MeetingDialogProps): JSX.Element => {
  const { values, errors, isPending, setField, submit, isNew, isConvened } = useSaveMeeting({ meeting, onSaved });
  const needsPlace = values.modality !== 'virtual';
  const needsUrl = values.modality !== 'in_person';
  const submitLabel = isNew ? (values.notify ? 'Convocar y notificar' : 'Guardar sin convocar') : values.notify ? (isConvened ? 'Guardar y avisar' : 'Guardar y convocar') : 'Guardar';

  return (
    <FormDialog wide title={isNew ? 'Nueva reunión de la APAFA' : 'Editar reunión'} description="La convocatoria llega a las familias en Comunicados, con la fecha, el lugar y la agenda." submitLabel={submitLabel} isPending={isPending} onSubmit={submit} onClose={onClose}>
      <FormField id="meeting-title" label="Título" required error={errors.title}>
        <Input id="meeting-title" value={values.title} maxLength={140} placeholder="Ej.: Asamblea general de rendición de cuentas" onChange={(e): void => setField('title', e.target.value)} aria-invalid={Boolean(errors.title)} className={controlClassName} />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="meeting-kind" label="Tipo de reunión" required error={errors.kind}>
          <SelectField id="meeting-kind" value={values.kind} options={items(kindLabels)} onChange={(v): void => setField('kind', v)} invalid={Boolean(errors.kind)} />
        </FormField>
        <FormField id="meeting-when" label="Fecha y hora" required error={errors.scheduled_at} hint={isConvened ? 'Ya convocada: para cambiar la fecha usa «Reprogramar».' : 'Hora de Lima.'}>
          <Input id="meeting-when" type="datetime-local" value={values.scheduledAt} disabled={isConvened} onChange={(e): void => setField('scheduledAt', e.target.value)} aria-invalid={Boolean(errors.scheduled_at)} className={controlClassName} />
        </FormField>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="meeting-modality" label="Modalidad" required error={errors.modality}>
          <SelectField id="meeting-modality" value={values.modality} options={items(modalityLabels)} onChange={(v): void => setField('modality', v)} />
        </FormField>
        <FormField id="meeting-audience" label="Se convoca a" required error={errors.audience}>
          <SelectField id="meeting-audience" value={values.audience} options={items(audienceLabels)} onChange={(v): void => setField('audience', v)} />
        </FormField>
      </div>
      {(needsPlace || needsUrl) && (
        <div className={needsPlace && needsUrl ? 'grid gap-4 sm:grid-cols-2' : 'grid gap-4'}>
          {needsPlace && (
            <FormField id="meeting-place" label="Lugar" required error={errors.place}>
              <Input id="meeting-place" value={values.place} maxLength={200} placeholder="Ej.: Patio central" onChange={(e): void => setField('place', e.target.value)} aria-invalid={Boolean(errors.place)} className={controlClassName} />
            </FormField>
          )}
          {needsUrl && (
            <FormField id="meeting-url" label="Enlace de la reunión" required error={errors.meeting_url}>
              <Input id="meeting-url" type="url" inputMode="url" value={values.meetingUrl} maxLength={500} placeholder="https://meet.google.com/…" onChange={(e): void => setField('meetingUrl', e.target.value)} aria-invalid={Boolean(errors.meeting_url)} className={controlClassName} />
            </FormField>
          )}
        </div>
      )}
      <FormField id="meeting-agenda" label="Agenda" error={errors.agenda} hint="Un punto por línea. Puedes adjuntar la agenda en PDF después.">
        <Textarea id="meeting-agenda" rows={5} value={values.agenda} maxLength={4000} placeholder={'1. Informe de la directiva\n2. Rendición de cuentas\n3. Varios'} onChange={(e): void => setField('agenda', e.target.value)} aria-invalid={Boolean(errors.agenda)} />
      </FormField>
      <ApafaNotifyToggle id="meeting-notify" label={isNew || !isConvened ? 'Convocar y notificar' : 'Avisar a las familias del cambio'} hint={isNew || !isConvened ? 'Publica la convocatoria en Comunicados. Si lo desactivas, la reunión queda como borrador y las familias no la ven.' : 'Publica un comunicado con los datos actualizados.'} checked={values.notify} disabled={isPending} onChange={(next): void => setField('notify', next)} />
    </FormDialog>
  );
};
