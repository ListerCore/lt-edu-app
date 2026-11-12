'use server';

import { cookies } from 'next/headers';
import { apiUpload } from '@/lib/api/server';
import { SESSION_COOKIE } from '@/lib/auth/cookies';
import type { AttachmentActionResult, HttpAttachment } from '../types';

// Uploads files to one owner (multipart POST /panel/attachments). The hook builds the FormData: institution,
// owner_kind, owner_id, category, title and every "files"
export const uploadAttachmentsAction = async (form: FormData): Promise<AttachmentActionResult<HttpAttachment[]>> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return { ok: false, message: 'Tu sesión venció. Ingresa de nuevo.' };
  const result = await apiUpload<{ attachments: HttpAttachment[] }>('/panel/attachments', form, { token });
  if (!result.ok) return { ok: false, message: result.error.fields?.files ?? result.error.fields?.category ?? result.error.message, fields: result.error.fields };
  return { ok: true, data: result.data.attachments, message: result.data.attachments.length === 1 ? 'Archivo subido.' : `${result.data.attachments.length} archivos subidos.` };
};
