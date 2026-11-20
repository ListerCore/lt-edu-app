import type { Announcement, AnnouncementAudience, AnnouncementKind, AttachmentKind, CtaLabel } from '../types';

// One shape for both lt-edu-api transports: gRPC (camelCase, Date) and the HTTP publish answer (snake_case)
interface RawAttachment {
  id: string;
  kind: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
}

interface RawAnnouncement {
  id: string;
  slug: string;
  kind: string;
  audience: string;
  title: string;
  body: string;
  isPublic: boolean;
  pinned: boolean;
  authorName: string;
  publishedAt?: Date | string;
  updatedAt?: Date | string;
  featuredFrom?: Date | string | null;
  featuredUntil?: Date | string | null;
  ctaLabel: string;
  ctaUrl: string;
  attachments: RawAttachment[];
}

const iso = (value: Date | string | null | undefined): string | null => (value instanceof Date ? value.toISOString() : (value ?? null));

export const attachmentUrl = (announcementId: string, attachmentId: string): string => `/api/files/announcements/${announcementId}/${attachmentId}`;

export const toAnnouncement = (a: RawAnnouncement): Announcement => ({
  id: a.id,
  slug: a.slug,
  kind: a.kind as AnnouncementKind,
  audience: a.audience as AnnouncementAudience,
  title: a.title,
  body: a.body,
  isPublic: a.isPublic,
  pinned: a.pinned,
  authorName: a.authorName,
  publishedAt: iso(a.publishedAt) ?? new Date(0).toISOString(),
  updatedAt: iso(a.updatedAt) ?? iso(a.publishedAt) ?? new Date(0).toISOString(),
  featuredFrom: iso(a.featuredFrom),
  featuredUntil: iso(a.featuredUntil),
  ctaLabel: a.ctaLabel === 'Ir' || a.ctaLabel === 'Continuar' ? (a.ctaLabel as CtaLabel) : '',
  ctaUrl: a.ctaUrl,
  attachments: a.attachments.map((att) => ({ id: att.id, kind: att.kind as AttachmentKind, fileName: att.fileName, contentType: att.contentType, sizeBytes: att.sizeBytes, url: attachmentUrl(a.id, att.id) })),
});

// POST /panel/announcements answers snake_case
interface HttpAnnouncement {
  id: string;
  slug: string;
  kind: string;
  audience: string;
  title: string;
  body: string;
  is_public: boolean;
  pinned: boolean;
  author_name: string;
  published_at: string;
  updated_at: string;
  featured_from: string | null;
  featured_until: string | null;
  cta_label: string;
  cta_url: string;
  attachments: Array<{ id: string; kind: string; file_name: string; content_type: string; size_bytes: number }>;
}

export type { HttpAnnouncement };

export const fromHttp = (a: HttpAnnouncement): Announcement =>
  toAnnouncement({
    id: a.id,
    slug: a.slug,
    kind: a.kind,
    audience: a.audience,
    title: a.title,
    body: a.body,
    isPublic: a.is_public,
    pinned: a.pinned,
    authorName: a.author_name,
    publishedAt: a.published_at,
    updatedAt: a.updated_at,
    featuredFrom: a.featured_from,
    featuredUntil: a.featured_until,
    ctaLabel: a.cta_label,
    ctaUrl: a.cta_url,
    attachments: a.attachments.map((att) => ({ id: att.id, kind: att.kind, fileName: att.file_name, contentType: att.content_type, sizeBytes: att.size_bytes })),
  });
