'use server';

import { cookies } from 'next/headers';
import { apiRequest } from '@/lib/api/server';
import { SESSION_COOKIE } from '@/lib/auth/cookies';
import { SLUG_PATTERN, UUID_PATTERN } from '@/features/protected/academic/data/academic-data';
import type { AttachmentActionResult, DeleteAttachmentParams } from '../types';

// Deletes one file and its stored bytes (DELETE /panel/attachments/:id)
export const deleteAttachmentAction = async ({ institution, id }: DeleteAttachmentParams): Promise<AttachmentActionResult<null>> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return { ok: false, message: 'Tu sesión venció. Ingresa de nuevo.' };
  if (!SLUG_PATTERN.test(institution) || !UUID_PATTERN.test(id)) return { ok: false, message: 'No encontramos este archivo.' };
  const result = await apiRequest<null>(`/panel/attachments/${id}?institution=${encodeURIComponent(institution)}`, { method: 'DELETE', token });
  if (!result.ok) return { ok: false, message: result.error.message };
  return { ok: true, data: null, message: 'Archivo eliminado.' };
};
