'use client';

import { useCallback, useState } from 'react';
import { sileo } from 'sileo';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { uploadAttachmentsAction } from '../actions/upload-attachments';
import { ATTACHMENT_MAX_BYTES, ATTACHMENTS_PER_UPLOAD, ATTACHMENTS_UPLOAD_MAX_BYTES, fileKindOfUpload } from '../data/attachments-data';
import type { UploadAttachmentsInput, UseUploadAttachmentsParams, UseUploadAttachmentsResult } from '../types';

// Spanish message for the first file the API would refuse, or null when every file passes
export const uploadProblem = (files: File[]): string | null => {
  if (files.length === 0) return 'Elige al menos un archivo.';
  if (files.length > ATTACHMENTS_PER_UPLOAD) return `Sube como máximo ${ATTACHMENTS_PER_UPLOAD} archivos a la vez.`;
  for (const file of files) {
    if (file.size === 0) return `El archivo ${file.name} está vacío.`;
    if (!fileKindOfUpload(file)) return `${file.name} no es un PDF, una imagen (PNG, JPG, WebP), un Word (.docx) ni un Excel (.xlsx).`;
    if (file.size > ATTACHMENT_MAX_BYTES) return `${file.name} supera los 10 MB.`;
  }
  if (files.reduce((total, file) => total + file.size, 0) > ATTACHMENTS_UPLOAD_MAX_BYTES) return 'Los archivos suman más de 40 MB. Súbelos en partes.';
  return null;
};

// Uploads files to one owner: checks them again, builds the multipart payload, toasts and reports success
export const useUploadAttachments = ({ ownerKind, ownerId, onUploaded }: UseUploadAttachmentsParams): UseUploadAttachmentsResult => {
  const institution = useInstitutionSlug();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async ({ files, category, title }: UploadAttachmentsInput): Promise<boolean> => {
      const problem = uploadProblem(files);
      if (problem) {
        setError(problem);
        return false;
      }
      // Payload lt-edu-api expects; empty title is left out so the API stores none
      const form = new FormData();
      form.set('institution', institution);
      form.set('owner_kind', ownerKind);
      form.set('owner_id', ownerId);
      form.set('category', category || 'other');
      const cleanTitle = title.trim();
      if (cleanTitle) form.set('title', cleanTitle);
      for (const file of files) form.append('files', file, file.name);

      setIsUploading(true);
      setError(null);
      try {
        const result = await uploadAttachmentsAction(form);
        if (!result.ok) {
          setError(result.message);
          sileo.error({ title: 'No se subieron los archivos', description: result.message });
          return false;
        }
        sileo.success({ title: result.message ?? 'Archivos subidos' });
        onUploaded();
        return true;
      } catch {
        // The server action itself failed (body too large for the proxy, network)
        const message = 'No pudimos subir los archivos. Inténtalo de nuevo.';
        setError(message);
        sileo.error({ title: 'No se subieron los archivos', description: message });
        return false;
      } finally {
        setIsUploading(false);
      }
    },
    [institution, ownerKind, ownerId, onUploaded],
  );

  const clearError = useCallback((): void => setError(null), []);

  return { upload, isUploading, error, clearError };
};
