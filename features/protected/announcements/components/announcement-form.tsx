'use client';

import type { FormEvent, JSX } from 'react';
import { CalendarClock, LoaderCircle, Save, Send } from 'lucide';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { MorphIcon } from '@/components/ui/morph-icon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { announcementKinds, audienceLabels, ctaLabels, kindMeta } from '../data/announcements-data';
import { useAnnouncementForm } from '../hooks/use-announcement-form';
import type { AnnouncementAudience, AnnouncementFormProps, AnnouncementKind, CtaLabel } from '../types';
import { AnnouncementFilesDropzone } from './announcement-files-dropzone';

const kindItems = announcementKinds.map((kind) => ({ value: kind, label: kindMeta[kind].label }));
const audienceItems = (Object.keys(audienceLabels) as AnnouncementAudience[]).map((value) => ({ value, label: audienceLabels[value] }));
const ctaItems = ctaLabels.map((value) => ({ value, label: value }));
const controlClassName = 'h-10 w-full rounded-lg bg-background';

// Publish or edit an announcement: content, images and PDFs, visibility and the validity window of the home modal
export const AnnouncementForm = ({ announcement, onSaved, onCancel }: AnnouncementFormProps): JSX.Element => {
  const { values, errors, isPending, setField, addFiles, removeFile, removeKept, submit } = useAnnouncementForm(announcement, onSaved);
  const editing = Boolean(announcement);

  const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    submit();
  };

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      <section className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="announcement-kind" label="Tipo" error={errors.kind}>
            <Select items={kindItems} value={values.kind} onValueChange={(value): void => setField('kind', value as AnnouncementKind)}>
              <SelectTrigger id="announcement-kind" className={controlClassName}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {kindItems.map((item): JSX.Element => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField id="announcement-audience" label="Dirigido a" error={errors.audience}>
            <Select items={audienceItems} value={values.audience} onValueChange={(value): void => setField('audience', value as AnnouncementAudience)}>
              <SelectTrigger id="announcement-audience" className={controlClassName}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {audienceItems.map((item): JSX.Element => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </div>

        <FormField id="announcement-title" label="Título" required error={errors.title}>
          <Input id="announcement-title" maxLength={160} placeholder="Ej. Cambio de horario el viernes" value={values.title} onChange={(event): void => setField('title', event.target.value)} aria-invalid={Boolean(errors.title)} aria-describedby={errors.title ? 'announcement-title-error' : undefined} className={controlClassName} />
        </FormField>

        <FormField id="announcement-body" label="Detalle" required error={errors.body}>
          <Textarea id="announcement-body" rows={7} maxLength={5000} placeholder="Qué pasa, cuándo y qué deben hacer." value={values.body} onChange={(event): void => setField('body', event.target.value)} aria-invalid={Boolean(errors.body)} aria-describedby={errors.body ? 'announcement-body-error' : undefined} className="min-h-40 rounded-lg bg-background" />
        </FormField>

        <AnnouncementFilesDropzone kept={values.kept} onRemoveKept={removeKept} files={values.files} error={errors.files} disabled={isPending} onAdd={addFiles} onRemove={removeFile} />

        <label className="flex cursor-pointer items-center gap-3 text-sm text-muted-foreground">
          <Checkbox checked={values.isPublic} onCheckedChange={(next): void => setField('isPublic', next)} />
          Mostrar también en la página pública
        </label>
      </section>

      <section aria-labelledby="announcement-featured" className={cn('flex flex-col gap-4 rounded-2xl border bg-background p-6', values.featured ? 'border-brand/40' : 'border-border')}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="announcement-featured" className="flex items-center gap-2 text-base font-semibold text-foreground">
              <MorphIcon icon={CalendarClock} size={16} className="text-brand" />
              Vigencia en el inicio
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{values.isPublic ? 'Mientras esté vigente se muestra en una ventana al entrar al sitio. Al terminar sigue en Comunicados.' : 'Solo las publicaciones públicas se muestran en el inicio.'}</p>
          </div>
          <Switch checked={values.featured} disabled={!values.isPublic || isPending} onCheckedChange={(next): void => setField('featured', next)} aria-label="Mostrar en el inicio durante una vigencia" />
        </div>

        {values.featured && values.isPublic && (
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="announcement-featured-from" label="Desde" error={errors.featured_from}>
              <Input id="announcement-featured-from" type="datetime-local" value={values.featuredFrom} onChange={(event): void => setField('featuredFrom', event.target.value)} className={controlClassName} />
            </FormField>
            <FormField id="announcement-featured-until" label="Hasta" required error={errors.featured_until}>
              <Input id="announcement-featured-until" type="datetime-local" value={values.featuredUntil} min={values.featuredFrom || undefined} onChange={(event): void => setField('featuredUntil', event.target.value)} aria-invalid={Boolean(errors.featured_until)} className={controlClassName} />
            </FormField>
            <FormField id="announcement-cta-label" label="Texto del botón" error={errors.cta_label}>
              <Select items={ctaItems} value={values.ctaLabel} onValueChange={(value): void => setField('ctaLabel', value as CtaLabel)}>
                <SelectTrigger id="announcement-cta-label" className={controlClassName}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ctaItems.map((item): JSX.Element => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField id="announcement-cta-url" label="Enlace del botón" error={errors.cta_url}>
              <Input id="announcement-cta-url" inputMode="url" placeholder="/admision o https://…" value={values.ctaUrl} onChange={(event): void => setField('ctaUrl', event.target.value)} aria-invalid={Boolean(errors.cta_url)} className={controlClassName} />
            </FormField>
            <p className="text-xs text-muted-foreground sm:col-span-2">Sin enlace, el botón lleva a la página de esta publicación. «Desde» vacío empieza ahora.</p>
          </div>
        )}
      </section>

      <div className="flex flex-wrap justify-end gap-2">
        <button type="button" onClick={onCancel} disabled={isPending} className="btn-alt">
          Cancelar
        </button>
        <button type="submit" disabled={isPending} className="btn-brand">
          <MorphIcon icon={isPending ? LoaderCircle : editing ? Save : Send} size={16} className={isPending ? 'animate-spin' : ''} />
          {isPending ? (editing ? 'Guardando…' : 'Publicando…') : editing ? 'Guardar cambios' : 'Publicar'}
        </button>
      </div>
    </form>
  );
};
