'use server';

import { cookies } from 'next/headers';
import { apiRequest } from '@/lib/api/server';
import { SESSION_COOKIE } from '@/lib/auth/cookies';
import { SLUG_PATTERN, UUID_PATTERN } from '@/features/protected/academic/data/academic-data';
import type { AttachmentActionResult, GetAttachmentsParams, HttpAttachmentList } from '../types';

// Files of one owner record, plus whether the person may upload or delete (GET /panel/attachments)
export const getAttachmentsAction = async ({ institution, ownerKind, ownerId }: GetAttachmentsParams): Promise<AttachmentActionResult<HttpAttachmentList>> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return { ok: false, message: 'Tu sesión venció. Ingresa de nuevo.' };
  // Ids that cannot exist never reach the API
  if (!SLUG_PATTERN.test(institution) || !UUID_PATTERN.test(ownerId)) return { ok: false, message: 'No encontramos el registro de estos archivos.' };
  const query = new URLSearchParams({ institution, owner_kind: ownerKind, owner_id: ownerId });
  const result = await apiRequest<HttpAttachmentList>(`/panel/attachments?${query.toString()}`, { token });
  if (!result.ok) return { ok: false, message: result.error.message, forbidden: result.status === 403 };
  return { ok: true, data: result.data };
};
