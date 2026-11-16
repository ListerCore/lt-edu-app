'use client';

import type { JSX } from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { MorphIcon } from '@/components/ui/morph-icon';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { SelectField, controlClassName } from '@/features/protected/academic/components/academic-ui';
import { FormDialog } from '@/features/protected/academic/components/form-dialog';
import { itemKinds } from '../data/classroom-data';
import { useSaveItem } from '../hooks/use-save-item';
import type { ItemDialogProps } from '../types';

// Create or edit a piece of material. The fields follow the kind; material taken from the library only edits its
// title and flags (its content lives in the library). Files are attached after saving
export const ItemDialog = ({ unitId, item, onClose, onSaved }: ItemDialogProps): JSX.Element => {
  const { values, errors, isPending, setField, submit } = useSaveItem({
    unitId,
    item,
    onSaved: (): void => {
      onSaved();
      onClose();
    },
  });
  const fromLibrary = Boolean(item?.libraryItemId);
  const meta = itemKinds[values.kind];
  const kindOptions = Object.entries(itemKinds).map(([value, k]) => ({ value, label: k.label }));
  const bodyLabel = values.kind === 'activity' ? 'Indicaciones' : values.kind === 'forum' ? 'Pregunta o consigna del foro' : values.kind === 'quiz' || values.kind === 'task' ? 'Indicaciones (opcional)' : values.kind === 'live' ? 'Qué se verá (opcional)' : 'Contenido';

  return (
    <FormDialog title={item ? 'Editar material' : 'Agregar material'} description={meta?.hint ?? ''} submitLabel={item ? 'Guardar' : 'Agregar'} isPending={isPending} onSubmit={submit} onClose={onClose} wide>
      <div className="grid gap-4 sm:grid-cols-[12rem_minmax(0,1fr)]">
        <FormField id="item-kind" label="Tipo" required error={errors.kind}>
          <SelectField id="item-kind" value={values.kind} options={kindOptions} disabled={Boolean(item)} onChange={(v): void => setField('kind', v)} invalid={Boolean(errors.kind)} />
        </FormField>
        <FormField id="item-title" label="Título" required error={errors.title}>
          <Input id="item-title" value={values.title} maxLength={160} onChange={(e): void => setField('title', e.target.value)} aria-invalid={Boolean(errors.title)} className={controlClassName} />
        </FormField>
      </div>

      {fromLibrary ? (
        <p className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2.5 text-sm text-muted-foreground">
          {meta && <MorphIcon icon={meta.icon} size={16} />}
          Viene de la biblioteca: el contenido, el enlace y los archivos se editan allí y se actualizan en todas las aulas que lo usan.
        </p>
      ) : (
        <>
          {(values.kind === 'video' || values.kind === 'link' || values.kind === 'live') && (
            <FormField id="item-url" label={values.kind === 'live' ? 'Enlace de la videollamada' : 'Dirección'} required error={errors.url}>
              <Input id="item-url" type="url" inputMode="url" placeholder="https://" value={values.url} maxLength={500} onChange={(e): void => setField('url', e.target.value)} aria-invalid={Boolean(errors.url)} className={controlClassName} />
            </FormField>
          )}
          {values.kind === 'live' && (
            <div className="grid gap-4 sm:grid-cols-3">
              <FormField id="item-starts" label="Día y hora (Lima)" required error={errors.startsAt}>
                <Input id="item-starts" type="datetime-local" value={values.startsAt} onChange={(e): void => setField('startsAt', e.target.value)} aria-invalid={Boolean(errors.startsAt)} className={controlClassName} />
              </FormField>
              <FormField id="item-duration" label="Minutos" required error={errors.durationMinutes}>
                <Input id="item-duration" inputMode="numeric" value={values.durationMinutes} onChange={(e): void => setField('durationMinutes', e.target.value.replace(/\D/g, '').slice(0, 3))} aria-invalid={Boolean(errors.durationMinutes)} className={controlClassName} />
              </FormField>
              <FormField id="item-recording" label="Grabación" error={errors.recordingUrl} hint="Después de la sesión.">
                <Input id="item-recording" type="url" inputMode="url" placeholder="https://" value={values.recordingUrl} maxLength={500} onChange={(e): void => setField('recordingUrl', e.target.value)} aria-invalid={Boolean(errors.recordingUrl)} className={controlClassName} />
              </FormField>
            </div>
          )}
          {values.kind !== 'file' && values.kind !== 'video' && values.kind !== 'link' && (
            <FormField id="item-body" label={bodyLabel} required={values.kind === 'reading' || values.kind === 'activity'} error={errors.body}>
              <Textarea id="item-body" rows={values.kind === 'reading' ? 10 : 5} value={values.body} maxLength={20000} onChange={(e): void => setField('body', e.target.value)} aria-invalid={Boolean(errors.body)} />
            </FormField>
          )}
          {values.kind === 'file' && <p className="text-sm text-muted-foreground">Guarda el material y luego adjunta los archivos desde la unidad.</p>}
        </>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2.5 text-sm">
          <span>
            <span className="block font-medium text-foreground">Material complementario</span>
            <span className="text-xs text-muted-foreground">Para profundizar; no es obligatorio</span>
          </span>
          <Switch checked={values.complementary} onCheckedChange={(next): void => setField('complementary', next)} />
        </label>
        <label className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2.5 text-sm">
          <span>
            <span className="block font-medium text-foreground">Publicado</span>
            <span className="text-xs text-muted-foreground">Visible cuando la unidad esté abierta</span>
          </span>
          <Switch checked={values.published} onCheckedChange={(next): void => setField('published', next)} />
        </label>
      </div>
    </FormDialog>
  );
};
