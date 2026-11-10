'use server';

import { updateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { announcementsRpc } from '@/lib/api/grpc/announcements';
import { apiUpload } from '@/lib/api/server';
import { SESSION_COOKIE } from '@/lib/auth/cookies';
import { siteInstitution } from '@/lib/site-institution';
import { NEWS_TAG } from '../data/announcements-data';
import { fromHttp, toAnnouncement, type HttpAnnouncement } from '../lib/to-announcement';
import type { Announcement, AnnouncementActionResult, AnnouncementFeed } from '../types';

const signedOut = { ok: false, message: 'Tu sesión venció. Ingresa de nuevo.' } as const;

// Panel feed over gRPC: what the role may read in the institution, and whether it may publish
export const getAnnouncementsAction = async (): Promise<AnnouncementActionResult<AnnouncementFeed>> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return signedOut;
  const result = await announcementsRpc.list(siteInstitution(), { token });
  if (!result.ok) return { ok: false, message: result.error.message };
  return { ok: true, message: 'ok', data: { announcements: result.data.announcements.map(toAnnouncement), canPublish: result.data.canPublish } };
};

// Publishes with its images and PDFs (multipart to joseph-api). Public ones refresh /news at once; open pages
// also hear about it over the live channel
export const createAnnouncementAction = async (form: FormData): Promise<AnnouncementActionResult<Announcement>> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return signedOut;
  form.set('institution', siteInstitution());
  const result = await apiUpload<{ announcement: HttpAnnouncement }>('/panel/announcements', form, { token });
  if (!result.ok) return { ok: false, message: result.error.message, fields: result.error.fields };
  updateTag(NEWS_TAG);
  return { ok: true, message: 'Publicado.', data: fromHttp(result.data.announcement) };
};
