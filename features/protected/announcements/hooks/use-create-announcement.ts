'use client';

import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { sileo } from 'sileo';
import { createAnnouncementAction } from '../actions/announcement-actions';
import { attachmentKindOf, formatBytes, IMAGE_MAX_BYTES, kindMeta, MAX_ATTACHMENTS, MAX_ATTACHMENTS_BYTES, PDF_MAX_BYTES } from '../data/announcements-data';
import type { Announcement, AnnouncementDraft, DraftErrors, UseCreateAnnouncementResult } from '../types';

const initialDraft: AnnouncementDraft = { kind: 'notice', title: '', body: '', audience: 'community', isPublic: true, files: [] };

let fileCounter = 0;

// Publishing form: fields, images and PDFs with their thumbnails; on success hands the announcement to the list
export const useCreateAnnouncement = (onCreated: (announcement: Announcement) => void): UseCreateAnnouncementResult => {
  const [values, setValues] = useState<AnnouncementDraft>(initialDraft);
  const [errors, setErrors] = useState<DraftErrors>({});
  const [isPending, startTransition] = useTransition();

  // Object URLs of image thumbnails, freed when removed, reset or on unmount
  const urls = useRef(new Set<string>());
  const releaseAll = useCallback((): void => {
    urls.current.forEach((url) => URL.revokeObjectURL(url));
    urls.current.clear();
  }, []);
  useEffect(() => releaseAll, [releaseAll]);

  const setField = useCallback(<K extends Exclude<keyof AnnouncementDraft, 'files'>>(field: K, value: AnnouncementDraft[K]): void => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }, []);

  // Keeps what fits (type, size, count, total) and explains the first file left out
  const addFiles = useCallback(
    (picked: File[]): void => {
      const next = [...values.files];
      let total = next.reduce((sum, { file }) => sum + file.size, 0);
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
        if (next.length >= MAX_ATTACHMENTS) {
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
        total += file.size;
      }
      setValues((current) => ({ ...current, files: next }));
      setErrors((current) => ({ ...current, files: problem }));
    },
    [values.files],
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

  const reset = useCallback((): void => {
    releaseAll();
    setValues(initialDraft);
    setErrors({});
  }, [releaseAll]);

  const submit = useCallback((): void => {
    const next: DraftErrors = {};
    if (values.title.trim().length < 5) next.title = 'Escribe un título de al menos 5 caracteres.';
    if (values.body.trim().length < 10) next.body = 'Escribe el detalle (mínimo 10 caracteres).';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const form = new FormData();
    form.set('kind', values.kind);
    form.set('audience', values.audience);
    form.set('title', values.title.trim());
    form.set('body', values.body.trim());
    form.set('is_public', String(values.isPublic));
    values.files.forEach(({ file }) => form.append('files', file, file.name));

    startTransition(async (): Promise<void> => {
      const result = await createAnnouncementAction(form);
      if (!result.ok || !result.data) {
        if (result.fields) setErrors({ title: result.fields.title, body: result.fields.body, files: result.fields.files, kind: result.fields.kind, audience: result.fields.audience });
        sileo.error({ title: 'No se publicó', description: result.message });
        return;
      }
      sileo.success({ title: `${kindMeta[values.kind].label} publicado`, description: values.isPublic ? 'También se muestra en la página pública.' : 'Solo se muestra dentro del panel.' });
      onCreated(result.data);
      reset();
    });
  }, [values, onCreated, reset]);

  return { values, errors, isPending, setField, addFiles, removeFile, submit, reset };
};
