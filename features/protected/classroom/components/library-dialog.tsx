'use client';

import type { JSX } from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SelectField, controlClassName } from '@/features/protected/academic/components/academic-ui';
import { FormDialog } from '@/features/protected/academic/components/form-dialog';
import { itemKinds, libraryKinds } from '../data/classroom-data';
import { useSaveLibraryItem } from '../hooks/use-save-library-item';
import type { LibraryDialogProps } from '../types';

// Create or edit a library entry; files are attached after saving
export const LibraryDialog = ({ entry, onClose, onSaved }: LibraryDialogProps): JSX.Element => {
  const { values, errors, isPending, setField, submit } = useSaveLibraryItem({
    entry,
    onSaved: (): void => {
      onSaved();
      onClose();
    },
  });
  return (
    <FormDialog title={entry ? 'Editar recurso' : 'Nuevo recurso'} description="Material que cualquier docente puede agregar a sus aulas. Los cambios se reflejan en todas." submitLabel={entry ? 'Guardar' : 'Agregar'} isPending={isPending} onSubmit={submit} onClose={onClose} wide>
      <div className="grid gap-4 sm:grid-cols-[12rem_minmax(0,1fr)]">
        <FormField id="lib-kind" label="Tipo" required error={errors.kind} hint={itemKinds[values.kind]?.hint}>
          <SelectField id="lib-kind" value={values.kind} options={libraryKinds.map((k) => ({ value: k, label: itemKinds[k].label }))} disabled={Boolean(entry && entry.uses > 0)} onChange={(v): void => setField('kind', v)} />
        </FormField>
        <FormField id="lib-title" label="Título" required error={errors.title}>
          <Input id="lib-title" value={values.title} maxLength={160} onChange={(e): void => setField('title', e.target.value)} aria-invalid={Boolean(errors.title)} className={controlClassName} />
        </FormField>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="lib-topic" label="Tema o área" error={errors.topic}>
          <Input id="lib-topic" placeholder="Ej.: Matemática" value={values.topic} maxLength={80} onChange={(e): void => setField('topic', e.target.value)} className={controlClassName} />
        </FormField>
        {(values.kind === 'video' || values.kind === 'link') && (
          <FormField id="lib-url" label="Dirección" required error={errors.url}>
            <Input id="lib-url" type="url" inputMode="url" placeholder="https://" value={values.url} maxLength={500} onChange={(e): void => setField('url', e.target.value)} aria-invalid={Boolean(errors.url)} className={controlClassName} />
          </FormField>
        )}
      </div>
      <FormField id="lib-description" label="Para qué sirve" error={errors.description}>
        <Textarea id="lib-description" rows={2} value={values.description} maxLength={1000} onChange={(e): void => setField('description', e.target.value)} />
      </FormField>
      {values.kind === 'reading' && (
        <FormField id="lib-body" label="Contenido" required error={errors.body}>
          <Textarea id="lib-body" rows={10} value={values.body} maxLength={20000} onChange={(e): void => setField('body', e.target.value)} aria-invalid={Boolean(errors.body)} />
        </FormField>
      )}
    </FormDialog>
  );
};
