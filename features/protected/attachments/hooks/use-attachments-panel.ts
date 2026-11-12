'use client';

import { useCallback, useState } from 'react';
import { formatBytes } from '@/features/protected/announcements/data/announcements-data';
import { fileKindOfUpload } from '../data/attachments-data';
import type { StagedFile, UseAttachmentsPanelParams, UseAttachmentsPanelResult } from '../types';
import { useAttachmentsAccess } from './use-attachments-access';
import { useDeleteAttachment } from './use-delete-attachment';
import { useGetAttachments } from './use-get-attachments';
import { uploadProblem, useUploadAttachments } from './use-upload-attachments';

let stagedSeq = 0;

// Everything AttachmentsPanel needs: the list, the staging area (picked files + category + title) and the
// upload/delete calls. Visibility follows the module's view permission; edit controls follow the API's can_edit
export const useAttachmentsPanel = ({ ownerKind, ownerId, module, categories, readOnly }: UseAttachmentsPanelParams): UseAttachmentsPanelResult => {
  const visible = useAttachmentsAccess({ ownerKind, module });

  const list = useGetAttachments({ ownerKind, ownerId, enabled: visible, categories });
  const [staged, setStaged] = useState<StagedFile[]>([]);
  const [pickError, setPickError] = useState<string | null>(null);
  const [chosenCategory, setChosenCategory] = useState('');
  const [title, setTitle] = useState('');

  const clearStaged = useCallback((): void => {
    setStaged([]);
    setPickError(null);
    setTitle('');
  }, []);

  const { upload, isUploading, error: uploadError, clearError } = useUploadAttachments({ ownerKind, ownerId, onUploaded: list.reload });
  const { remove, deletingId } = useDeleteAttachment({ onDeleted: list.reload });

  const editable = list.canEdit && !readOnly;
  const full = list.attachments.length >= list.maxFiles;
  // A chosen category that is no longer offered falls back to the first one
  const category = list.categories.some(({ value }) => value === chosenCategory) ? chosenCategory : (list.categories[0]?.value ?? 'other');

  // Adds picked or dropped files: refuses at once each file the API would refuse, keeps the valid ones up to the
  // room the owner has left, and reports upload-wide problems (count, total size) without dropping files
  const addFiles = useCallback(
    (files: File[]): void => {
      clearError();
      const room = Math.max(0, list.maxFiles - list.attachments.length);
      const valid = files.filter((file) => uploadProblem([file]) === null);
      const rejected = files.find((file) => !valid.includes(file));
      const next = [...staged, ...valid.map((file): StagedFile => ({ key: `staged-${(stagedSeq += 1)}`, file, fileKind: fileKindOfUpload(file) ?? 'other', sizeLabel: formatBytes(file.size) }))];
      const kept = next.slice(0, room);
      let problem = rejected ? uploadProblem([rejected]) : null;
      if (!problem && next.length > room) problem = `Este registro admite ${list.maxFiles} archivos; quedan ${room} espacios.`;
      if (!problem && kept.length > 0) problem = uploadProblem(kept.map(({ file }) => file));
      setStaged(kept);
      setPickError(problem);
    },
    [clearError, list.maxFiles, list.attachments.length, staged],
  );

  const unstage = useCallback(
    (key: string): void => {
      const kept = staged.filter((item) => item.key !== key);
      setStaged(kept);
      clearError();
      setPickError(kept.length > 0 ? uploadProblem(kept.map(({ file }) => file)) : null);
    },
    [staged, clearError],
  );

  const submit = useCallback((): void => {
    void upload({ files: staged.map(({ file }) => file), category, title }).then((ok): void => {
      if (ok) clearStaged();
    });
  }, [upload, staged, category, title, clearStaged]);

  return {
    visible,
    forbidden: list.forbidden,
    attachments: list.attachments,
    categories: list.categories,
    maxFiles: list.maxFiles,
    editable,
    full,
    isLoading: list.isLoading,
    loadError: list.error,
    reload: list.reload,
    staged,
    stageError: pickError ?? uploadError,
    addFiles,
    unstage,
    clearStaged,
    category,
    setCategory: setChosenCategory,
    title,
    setTitle,
    submit,
    canSubmit: editable && staged.length > 0 && pickError === null && !isUploading,
    isUploading,
    remove,
    deletingId,
  };
};
