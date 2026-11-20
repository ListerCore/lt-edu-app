'use server';

import { updateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { announcementsRpc } from '@/lib/api/grpc/announcements';
import { apiRequest, apiUpload } from '@/lib/api/server';
import { SESSION_COOKIE } from '@/lib/auth/cookies';
import { siteInstitution } from '@/lib/site-institution';
import { NEWS_TAG, SLUG_PATTERN } from '../data/announcements-data';
import { fromHttp, toAnnouncement, type HttpAnnouncement } from '../lib/to-announcement';
import type { Announcement, AnnouncementActionResult, AnnouncementDetail, AnnouncementFeed } from '../types';

const signedOut = { ok: false, message: 'Tu sesión venció. Ingresa de nuevo.' } as const;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

const sessionToken = async (): Promise<string | undefined> => (await cookies()).get(SESSION_COOKIE)?.value;

// Panel feed over gRPC: what the role may read in the institution, and whether it may publish
export const getAnnouncementsAction = async (): Promise<AnnouncementActionResult<AnnouncementFeed>> => {
  const token = await sessionToken();
  if (!token) return signedOut;
  const result = await announcementsRpc.list(siteInstitution(), { token });
  if (!result.ok) return { ok: false, message: result.error.message };
  return { ok: true, message: 'ok', data: { announcements: result.data.announcements.map(toAnnouncement), canPublish: result.data.canPublish } };
};

// Panel detail over gRPC (/dashboard/announcements/<slug>), with whether the person may edit or delete it
export const getAnnouncementAction = async (slug: string): Promise<AnnouncementActionResult<AnnouncementDetail>> => {
  const token = await sessionToken();
  if (!token) return signedOut;
  if (!SLUG_PATTERN.test(slug)) return { ok: false, message: 'No encontramos esta publicación.' };
  const result = await announcementsRpc.get(slug, siteInstitution(), { token });
  if (!result.ok || !result.data.announcement) return { ok: false, message: result.ok ? 'No encontramos esta publicación.' : result.error.message };
  return { ok: true, message: 'ok', data: { announcement: toAnnouncement(result.data.announcement), canEdit: result.data.canEdit } };
};

// Publishes with its images and PDFs (multipart to lt-edu-api). /news refreshes at once; open pages hear it live
export const createAnnouncementAction = async (form: FormData): Promise<AnnouncementActionResult<Announcement>> => {
  const token = await sessionToken();
  if (!token) return signedOut;
  form.set('institution', siteInstitution());
  const result = await apiUpload<{ announcement: HttpAnnouncement }>('/panel/announcements', form, { token });
  if (!result.ok) return { ok: false, message: result.error.message, fields: result.error.fields };
  updateTag(NEWS_TAG);
  return { ok: true, message: 'Publicado.', data: fromHttp(result.data.announcement) };
};

// Edits fields and attachments ("keep" lists the stored ones that stay, in order; "files" adds new ones)
export const updateAnnouncementAction = async (id: string, form: FormData): Promise<AnnouncementActionResult<Announcement>> => {
  const token = await sessionToken();
  if (!token) return signedOut;
  if (!UUID.test(id)) return { ok: false, message: 'No encontramos esta publicación.' };
  form.set('institution', siteInstitution());
  const result = await apiUpload<{ announcement: HttpAnnouncement }>(`/panel/announcements/${id}`, form, { method: 'PUT', token });
  if (!result.ok) return { ok: false, message: result.error.message, fields: result.error.fields };
  updateTag(NEWS_TAG);
  return { ok: true, message: 'Cambios guardados.', data: fromHttp(result.data.announcement) };
};

// Deletes the announcement and its files
export const deleteAnnouncementAction = async (id: string): Promise<AnnouncementActionResult<null>> => {
  const token = await sessionToken();
  if (!token) return signedOut;
  if (!UUID.test(id)) return { ok: false, message: 'No encontramos esta publicación.' };
  const result = await apiRequest(`/panel/announcements/${id}?institution=${encodeURIComponent(siteInstitution())}`, { method: 'DELETE', token });
  if (!result.ok) return { ok: false, message: result.error.message };
  updateTag(NEWS_TAG);
  return { ok: true, message: 'Publicación eliminada.', data: null };
};
