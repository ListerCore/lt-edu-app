'use client';

import { useCallback, useState } from 'react';
import { sileo } from 'sileo';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { deleteAttachmentAction } from '../actions/delete-attachment';
import type { Attachment, UseDeleteAttachmentParams, UseDeleteAttachmentResult } from '../types';

// Deletes one file (after the component's confirmation) and tells the list to refresh
export const useDeleteAttachment = ({ onDeleted }: UseDeleteAttachmentParams): UseDeleteAttachmentResult => {
  const institution = useInstitutionSlug();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const remove = useCallback(
    (attachment: Attachment): void => {
      setDeletingId(attachment.id);
      void deleteAttachmentAction({ institution, id: attachment.id })
        .then((result): void => {
          if (!result.ok) {
            sileo.error({ title: 'No se eliminó el archivo', description: result.message });
            return;
          }
          sileo.success({ title: 'Archivo eliminado', description: attachment.fileName });
          onDeleted();
        })
        .catch((): void => {
          sileo.error({ title: 'No se eliminó el archivo', description: 'Inténtalo de nuevo en unos segundos.' });
        })
        .finally((): void => setDeletingId(null));
    },
    [institution, onDeleted],
  );

  return { remove, deletingId };
};
