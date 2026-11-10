'use client';

import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { sileo } from 'sileo';
import { createAnnouncementAction, updateAnnouncementAction } from '../actions/announcement-actions';
import { attachmentKindOf, CTA_URL_PATTERN, formatBytes, fromLocalInput, IMAGE_MAX_BYTES, kindMeta, MAX_ATTACHMENTS, MAX_ATTACHMENTS_BYTES, PDF_MAX_BYTES, toLocalInput } from '../data/announcements-data';
import type { Announcement, AnnouncementDraft, DraftErrors, DraftField, UseAnnouncementFormResult } from '../types';

const draftFrom = (announcement?: Announcement): AnnouncementDraft => ({
  kind: announcement?.kind ?? 'notice',
  title: announcement?.title ?? '',
  body: announcement?.body ?? '',
  audience: announcement?.audience ?? 'community',
  isPublic: announcement?.isPublic ?? true,
  featured: Boolean(announcement?.featuredUntil),
  featuredFrom: toLocalInput(announcement?.featuredFrom ?? null),
  featuredUntil: toLocalInput(announcement?.featuredUntil ?? null),
  ctaLabel: announcement?.ctaLabel || 'Continuar',
  ctaUrl: announcement?.ctaUrl ?? '',
  kept: announcement?.attachments ?? [],
  files: [],
});

let fileCounter = 0;

// Publish and edit form: fields, validity window of the home modal, stored attachments that stay and new images
// or PDFs with their thumbnails. Without an announcement it publishes; with one it saves the changes
export const useAnnouncementForm = (announcement: Announcement | undefined, onSaved: (saved: Announcement) => void): UseAnnouncementFormResult => {
  const [values, setValues] = useState<AnnouncementDraft>(() => draftFrom(announcement));
  const [errors, setErrors] = useState<DraftErrors>({});
  const [isPending, startTransition] = useTransition();

  // Object URLs of new image thumbnails, freed when removed and on unmount
  const urls = useRef(new Set<string>());
  useEffect(() => {
    const owned = urls.current;
    return () => owned.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const setField = useCallback(<K extends DraftField>(field: K, value: AnnouncementDraft[K]): void => {
    setValues((current) => {
      const next = { ...current, [field]: value };
      // Only public announcements are featured on the site's home
      if (field === 'isPublic' && !value) next.featured = false;
      return next;
    });
    setErrors((current) => ({ ...current, [field === 'featuredFrom' ? 'featured_from' : field === 'featuredUntil' ? 'featured_until' : field === 'ctaUrl' ? 'cta_url' : field]: undefined }));
  }, []);

  // Keeps what fits (type, size, count and total, counting the stored files that stay) and explains what did not
  const addFiles = useCallback(
    (picked: File[]): void => {
      const next = [...values.files];
      let count = values.kept.length + next.length;
      let total = values.kept.reduce((sum, { sizeBytes }) => sum + sizeBytes, 0) + next.reduce((sum, { file }) => sum + file.size, 0);
      let problem: string | undefined;
      for (const file of picked) {
        const kind = attachmentKindOf(file.type);
        if (!kind) {
          problem ??= `${file.name}: usa imágenes PNG, JPG o WebP, o un PDF.`;
          continue;
        }
        const limit = kind === 'image' ? IMAGE_MAX_BYTES : PDF_MAX_BYTES;
        if (file.size > limit) {
          problem ??= `${file.name} pesa ${formatBytes(file.size)}; el máximo es ${formatBytes(limit)}.`;
          continue;
        }
        if (count >= MAX_ATTACHMENTS) {
          problem ??= `Puedes adjuntar hasta ${MAX_ATTACHMENTS} archivos.`;
          break;
        }
        if (total + file.size > MAX_ATTACHMENTS_BYTES) {
          problem ??= `Los archivos no pueden sumar más de ${formatBytes(MAX_ATTACHMENTS_BYTES)}.`;
          continue;
        }
        const previewUrl = kind === 'image' ? URL.createObjectURL(file) : null;
        if (previewUrl) urls.current.add(previewUrl);
        fileCounter += 1;
        next.push({ key: `f${fileCounter}`, file, kind, previewUrl });
        count += 1;
        total += file.size;
      }
      setValues((current) => ({ ...current, files: next }));
      setErrors((current) => ({ ...current, files: problem }));
    },
    [values.files, values.kept],
  );

  const removeFile = useCallback((key: string): void => {
    setValues((current) => {
      const removed = current.files.find((file) => file.key === key);
      if (removed?.previewUrl) {
        URL.revokeObjectURL(removed.previewUrl);
        urls.current.delete(removed.previewUrl);
      }
      return { ...current, files: current.files.filter((file) => file.key !== key) };
    });
    setErrors((current) => ({ ...current, files: undefined }));
  }, []);

  const removeKept = useCallback((id: string): void => {
    setValues((current) => ({ ...current, kept: current.kept.filter((attachment) => attachment.id !== id) }));
    setErrors((current) => ({ ...current, files: undefined }));
  }, []);

  const submit = useCallback((): void => {
    const next: DraftErrors = {};
    if (values.title.trim().length < 5) next.title = 'Escribe un título de al menos 5 caracteres.';
    if (values.body.trim().length < 10) next.body = 'Escribe el detalle (mínimo 10 caracteres).';
    if (values.featured) {
      const from = values.featuredFrom ? Date.parse(values.featuredFrom) : Date.now();
      const until = values.featuredUntil ? Date.parse(values.featuredUntil) : NaN;
      if (Number.isNaN(until)) next.featured_until = 'Indica hasta cuándo se muestra en el inicio.';
      else if (until <= from) next.featured_until = 'La vigencia debe terminar después de empezar.';
      if (values.ctaUrl.trim() && !CTA_URL_PATTERN.test(values.ctaUrl.trim())) next.cta_url = 'Usa una ruta del sitio (/admision) o una dirección https://.';
    }
    setErrors(next);
    if (Object.keys(next).length > 0) {
      sileo.warning({ title: 'Revisa el formulario', description: 'Hay campos sin completar o con errores.' });
      return;
    }

    const form = new FormData();
    form.set('kind', values.kind);
    form.set('audience', values.audience);
    form.set('title', values.title.trim());
    form.set('body', values.body.trim());
    form.set('is_public', String(values.isPublic));
    if (values.featured && values.isPublic) {
      form.set('featured_from', fromLocalInput(values.featuredFrom) ?? new Date().toISOString());
      form.set('featured_until', fromLocalInput(values.featuredUntil) ?? '');
      form.set('cta_label', values.ctaLabel);
      form.set('cta_url', values.ctaUrl.trim());
    }
    values.kept.forEach(({ id }) => form.append('keep', id));
    values.files.forEach(({ file }) => form.append('files', file, file.name));

    startTransition(async (): Promise<void> => {
      const result = announcement ? await updateAnnouncementAction(announcement.id, form) : await createAnnouncementAction(form);
      if (!result.ok || !result.data) {
        if (result.fields) setErrors(result.fields as DraftErrors);
        sileo.error({ title: announcement ? 'No se guardaron los cambios' : 'No se publicó', description: result.message });
        return;
      }
      sileo.success(announcement ? { title: 'Cambios guardados', description: 'La publicación ya está actualizada.' } : { title: `${kindMeta[values.kind].label} publicado`, description: values.isPublic ? 'También se muestra en la página pública.' : 'Solo se muestra dentro del panel.' });
      onSaved(result.data);
    });
  }, [values, announcement, onSaved]);

  return { values, errors, isPending, setField, addFiles, removeFile, removeKept, submit };
};
