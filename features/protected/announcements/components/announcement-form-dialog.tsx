'use client';

import { useState, type FormEvent, type JSX } from 'react';
import { LoaderCircle, Plus, Send } from 'lucide';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { MorphIcon } from '@/components/ui/morph-icon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { announcementKinds, audienceLabels, kindMeta } from '../data/announcements-data';
import { useCreateAnnouncement } from '../hooks/use-create-announcement';
import type { Announcement, AnnouncementAudience, AnnouncementFormDialogProps, AnnouncementKind } from '../types';
import { AnnouncementImageDropzone } from './announcement-image-dropzone';

const kindItems = announcementKinds.map((kind) => ({ value: kind, label: kindMeta[kind].label }));
const audienceItems = (Object.keys(audienceLabels) as AnnouncementAudience[]).map((value) => ({ value, label: audienceLabels[value] }));
const controlClassName = 'h-10 w-full rounded-lg bg-background';

// "Publicar" button + dialog to write an announcement, notice or alert (only for roles that can create)
export const AnnouncementFormDialog = ({ onCreated }: AnnouncementFormDialogProps): JSX.Element => {
  const [open, setOpen] = useState(false);
  const { values, errors, isPending, setField, setImage, removeImage, submit } = useCreateAnnouncement((announcement: Announcement): void => {
    onCreated(announcement);
    setOpen(false);
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    submit();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<button type="button" className="btn-brand" />}>
        <MorphIcon icon={Plus} size={16} />
        Publicar
      </DialogTrigger>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Nueva publicación</DialogTitle>
          <DialogDescription>Elige el tipo y a quién va dirigida. Las públicas también aparecen en la página de comunicados del sitio.</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} noValidate className="mt-2 flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="announcement-kind" label="Tipo">
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
            <FormField id="announcement-audience" label="Dirigido a">
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
            <Input id="announcement-title" placeholder="Ej. Cambio de horario el viernes" value={values.title} onChange={(event): void => setField('title', event.target.value)} aria-invalid={Boolean(errors.title)} aria-describedby={errors.title ? 'announcement-title-error' : undefined} className={controlClassName} />
          </FormField>

          <FormField id="announcement-summary" label="Detalle" required error={errors.summary}>
            <Textarea id="announcement-summary" rows={4} maxLength={600} placeholder="Qué pasa, cuándo y qué deben hacer." value={values.summary} onChange={(event): void => setField('summary', event.target.value)} aria-invalid={Boolean(errors.summary)} aria-describedby={errors.summary ? 'announcement-summary-error' : undefined} className="min-h-24 rounded-lg bg-background" />
          </FormField>

          <AnnouncementImageDropzone imageUrl={values.imageUrl} error={errors.image} disabled={isPending} onSelect={setImage} onRemove={removeImage} />

          <label className="flex cursor-pointer items-center gap-3 text-sm text-muted-foreground">
            <Checkbox checked={values.isPublic} onCheckedChange={(next): void => setField('isPublic', next)} />
            Mostrar también en la página pública
          </label>

          <button type="submit" disabled={isPending} className="btn-brand mt-2 self-end">
            <MorphIcon icon={isPending ? LoaderCircle : Send} size={16} className={isPending ? 'animate-spin' : ''} />
            {isPending ? 'Publicando…' : 'Publicar'}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
