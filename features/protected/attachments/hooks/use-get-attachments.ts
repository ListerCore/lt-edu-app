'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { formatBytes } from '@/features/protected/announcements/data/announcements-data';
import { getAttachmentsAction } from '../actions/get-attachments';
import { attachmentFileUrl, categoryLabel, fileKindOf, formatAttachmentDate } from '../data/attachments-data';
import type { Attachment, AttachmentCategoryOption, HttpAttachment, HttpAttachmentList, UseGetAttachmentsParams, UseGetAttachmentsResult } from '../types';

interface ListState {
  // Key of the owner the data belongs to, so a stale answer never shows under another owner
  key: string;
  data: HttpAttachmentList | null;
  error: string | null;
  forbidden: boolean;
}

// API row → what the list renders (labels, sizes, dates and the proxy URL already prepared)
const toAttachment = (row: HttpAttachment): Attachment => {
  const fileKind = fileKindOf(row.content_type);
  return {
    id: row.id,
    category: row.category,
    categoryLabel: categoryLabel(row.category),
    title: row.title,
    description: row.description,
    fileName: row.file_name,
    contentType: row.content_type,
    fileKind,
    sizeBytes: row.size_bytes,
    sizeLabel: formatBytes(row.size_bytes),
    uploadedName: row.uploaded_name,
    createdAt: row.created_at,
    createdLabel: formatAttachmentDate(row.created_at),
    url: attachmentFileUrl(row.id),
    canPreview: fileKind === 'pdf' || fileKind === 'image',
    canDelete: row.can_delete,
  };
};

// Files of one owner record and whether the person may change them; reload() fetches again after a change
export const useGetAttachments = ({ ownerKind, ownerId, enabled = true, categories }: UseGetAttachmentsParams): UseGetAttachmentsResult => {
  const institution = useInstitutionSlug();
  const key = `${institution}:${ownerKind}:${ownerId}`;
  const [state, setState] = useState<ListState>({ key: '', data: null, error: null, forbidden: false });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    void getAttachmentsAction({ institution, ownerKind, ownerId }).then((result): void => {
      if (!active) return;
      setState(result.ok ? { key, data: result.data, error: null, forbidden: false } : { key, data: null, error: result.message, forbidden: Boolean(result.forbidden) });
    });
    return (): void => {
      active = false;
    };
  }, [enabled, institution, ownerKind, ownerId, key, version]);

  const reload = useCallback((): void => setVersion((current) => current + 1), []);

  const current = state.key === key ? state : null;
  const attachments = useMemo((): Attachment[] => (current?.data?.attachments ?? []).map(toAttachment), [current?.data]);

  // Categories the API allows for this owner, narrowed and ordered by the page when it asks for fewer
  const categoryOptions = useMemo((): AttachmentCategoryOption[] => {
    const allowed = current?.data?.categories ?? [];
    const chosen = categories ? categories.filter((value) => allowed.includes(value)) : allowed;
    return (chosen.length > 0 ? chosen : allowed).map((value) => ({ value, label: categoryLabel(value) }));
  }, [current?.data, categories]);

  return {
    attachments,
    canEdit: current?.data?.can_edit ?? false,
    categories: categoryOptions,
    maxFiles: current?.data?.max_files ?? 20,
    isLoading: enabled && current === null,
    error: current?.error ?? null,
    forbidden: current?.forbidden ?? false,
    reload,
  };
};
