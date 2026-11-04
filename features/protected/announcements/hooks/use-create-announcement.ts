'use client';

import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { sileo } from 'sileo';
import { createAnnouncementAction } from '../actions/announcement-actions';
import { IMAGE_MAX_BYTES, IMAGE_TYPES, kindMeta } from '../data/announcements-data';
import type { Announcement, AnnouncementDraft, UseCreateAnnouncementResult } from '../types';

const initialDraft: AnnouncementDraft = { kind: 'notice', title: '', summary: '', audience: 'community', isPublic: true, imageUrl: null };

// Publishing form state; on success hands the new announcement to the list
export const useCreateAnnouncement = (onCreated: (announcement: Announcement) => void): UseCreateAnnouncementResult => {
  const [values, setValues] = useState<AnnouncementDraft>(initialDraft);
  const [errors, setErrors] = useState<UseCreateAnnouncementResult['errors']>({});
  const [isPending, startTransition] = useTransition();

  const setField = useCallback(<K extends keyof AnnouncementDraft>(field: K, value: AnnouncementDraft[K]): void => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }, []);

  // Object URL of the preview that has not been published yet; freed when replaced, removed or on unmount
  const pendingUrl = useRef<string | null>(null);
  const releasePending = useCallback((): void => {
    if (pendingUrl.current) URL.revokeObjectURL(pendingUrl.current);
    pendingUrl.current = null;
  }, []);
  useEffect(() => releasePending, [releasePending]);

  // Validates type and size, then shows a local preview (simulated upload)
  const setImage = useCallback(
    (file: File): void => {
      if (!IMAGE_TYPES.includes(file.type)) {
        setErrors((current) => ({ ...current, image: 'Usa una imagen PNG, JPG o WebP.' }));
        return;
      }
      if (file.size > IMAGE_MAX_BYTES) {
        setErrors((current) => ({ ...current, image: 'La imagen supera los 5 MB.' }));
        return;
      }
      releasePending();
      const url = URL.createObjectURL(file);
      pendingUrl.current = url;
      setValues((current) => ({ ...current, imageUrl: url }));
      setErrors((current) => ({ ...current, image: undefined }));
    },
    [releasePending],
  );

  const removeImage = useCallback((): void => {
    releasePending();
    setValues((current) => ({ ...current, imageUrl: null }));
  }, [releasePending]);

  const reset = useCallback((): void => {
    releasePending();
    setValues(initialDraft);
    setErrors({});
  }, [releasePending]);

  const submit = useCallback((): void => {
    const next: UseCreateAnnouncementResult['errors'] = {};
    if (values.title.trim().length < 5) next.title = 'Escribe un título de al menos 5 caracteres.';
    if (values.summary.trim().length < 10) next.summary = 'Escribe el detalle (mínimo 10 caracteres).';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    startTransition(async (): Promise<void> => {
      const result = await createAnnouncementAction(values);
      if (!result.ok || !result.data) {
        sileo.error({ title: 'No se publicó', description: result.message });
        return;
      }
      sileo.success({ title: `${kindMeta[values.kind].label} publicado`, description: values.isPublic ? 'También se muestra en la página pública.' : 'Solo se muestra dentro del panel.' });
      onCreated(result.data);
      // The published card now owns the preview URL, so it must not be revoked
      pendingUrl.current = null;
      reset();
    });
  }, [values, onCreated, reset]);

  return { values, errors, isPending, setField, setImage, removeImage, submit, reset };
};
