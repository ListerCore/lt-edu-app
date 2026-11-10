import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { NEWS_TAG, SLUG_PATTERN, sortAnnouncements } from '@/features/protected/announcements/data/announcements-data';
import { toAnnouncement } from '@/features/protected/announcements/lib/to-announcement';
import type { Announcement } from '@/features/protected/announcements/types';
import { announcementsRpc } from '@/lib/api/grpc/announcements';
import { siteInstitution } from '@/lib/site-institution';

export type NewsResult = { ok: true; items: Announcement[] } | { ok: false };
export type NewsItemResult = { ok: true; item: Announcement | null } | { ok: false };

// Public announcements over gRPC, cached for minutes and refreshed at once when the panel publishes (updateTag).
// A failure is returned (never thrown: that would break prerendering) and kept only for seconds, so an outage
// heals by itself
const fetchPublicNews = async (institution: string): Promise<NewsResult> => {
  'use cache';
  cacheTag(NEWS_TAG);
  const result = await announcementsRpc.listPublic(institution, { anonymous: true, timeoutMs: 5000 });
  if (!result.ok) {
    cacheLife('seconds');
    console.warn('[news] joseph-api unavailable:', result.error.code);
    return { ok: false };
  }
  cacheLife('minutes');
  return { ok: true, items: sortAnnouncements(result.data.announcements.map(toAnnouncement)) };
};

// One public announcement, cached on its own key: item null when it does not exist or is internal
const fetchPublicNewsItem = async (slug: string): Promise<NewsItemResult> => {
  'use cache';
  cacheTag(NEWS_TAG);
  const result = await announcementsRpc.getPublic(slug, { anonymous: true, timeoutMs: 5000 });
  if (!result.ok && result.error.code !== 'not_found') {
    cacheLife('seconds');
    console.warn('[news] joseph-api unavailable:', result.error.code);
    return { ok: false };
  }
  cacheLife('minutes');
  return { ok: true, item: result.ok && result.data.announcement ? toAnnouncement(result.data.announcement) : null };
};

export const getPublicNews = (): Promise<NewsResult> => fetchPublicNews(siteInstitution());

export const getPublicNewsItem = async (slug: string): Promise<NewsItemResult> => (SLUG_PATTERN.test(slug) ? fetchPublicNewsItem(slug) : { ok: true, item: null });
