'use client';

import { useCallback, useState, useTransition } from 'react';
import { sileo } from 'sileo';
import { IMAGE_MAX_BYTES, IMAGE_TYPES } from '@/features/protected/announcements/data/announcements-data';
import { updateCardholderPhotoAction } from '../actions/card-actions';
import type { UseUpdateCardholderPhotoResult } from '../types';
import { setCardholderPhoto } from './use-cardholder-photos';

// Validates and uploads a cardholder photo (simulated: a local preview URL); the table and the card pick it up
export const useUpdateCardholderPhoto = (): UseUpdateCardholderPhotoResult => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const setPhoto = useCallback((id: string, file: File): void => {
    if (!IMAGE_TYPES.includes(file.type)) {
      setError('Usa una foto PNG, JPG o WebP.');
      return;
    }
    if (file.size > IMAGE_MAX_BYTES) {
      setError('La foto supera los 5 MB.');
      return;
    }
    setError(null);
    const url = URL.createObjectURL(file);
    startTransition(async (): Promise<void> => {
      const result = await updateCardholderPhotoAction(id, url);
      if (!result.ok || !result.data) {
        URL.revokeObjectURL(url);
        sileo.error({ title: 'No se guardó la foto', description: result.message });
        return;
      }
      setCardholderPhoto(result.data.id, result.data.photoUrl);
      sileo.success({ title: 'Foto actualizada', description: 'Ya aparece en la lista y en el carnet.' });
    });
  }, []);

  return { setPhoto, error, isPending };
};
