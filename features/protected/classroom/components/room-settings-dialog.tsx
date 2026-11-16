'use client';

import type { JSX } from 'react';
import { FormField } from '@/components/ui/form-field';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { FormDialog } from '@/features/protected/academic/components/form-dialog';
import { useUpdateRoom } from '../hooks/use-update-room';
import type { RoomSettingsDialogProps } from '../types';

// Welcome text of the room and whether students see it
export const RoomSettingsDialog = ({ room, onClose, onSaved }: RoomSettingsDialogProps): JSX.Element => {
  const { values, errors, isPending, setField, submit } = useUpdateRoom({
    room,
    onSaved: (): void => {
      onSaved();
      onClose();
    },
  });
  return (
    <FormDialog title="Ajustes del aula" description={`${room.subjectName} · ${room.gradeName || room.levelName}`} submitLabel="Guardar" isPending={isPending} onSubmit={submit} onClose={onClose}>
      <FormField id="room-description" label="Bienvenida" error={errors.description} hint="Lo primero que leen los estudiantes: cómo trabajar el aula y cómo contactar al docente.">
        <Textarea id="room-description" rows={5} value={values.description} maxLength={2000} onChange={(e): void => setField('description', e.target.value)} aria-invalid={Boolean(errors.description)} />
      </FormField>
      <label className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2.5 text-sm">
        <span>
          <span className="block font-medium text-foreground">Aula publicada</span>
          <span className="text-xs text-muted-foreground">Los estudiantes del grado la ven en su panel</span>
        </span>
        <Switch checked={values.published} onCheckedChange={(next): void => setField('published', next)} />
      </label>
    </FormDialog>
  );
};
