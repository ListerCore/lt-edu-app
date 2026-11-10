import { Bell, Megaphone, TriangleAlert } from 'lucide';
import type { Announcement, AnnouncementAttachment, AnnouncementAudience, AnnouncementKind, AttachmentKind, KindMeta } from '../types';

export const ANNOUNCEMENTS_PATH = '/dashboard/announcements';
export const NEWS_PATH = '/news';
export const newsPath = (slug: string): string => `${NEWS_PATH}/${slug}`;
export const NEW_ANNOUNCEMENT_PATH = `${ANNOUNCEMENTS_PATH}/new`;
export const panelAnnouncementPath = (slug: string): string => `${ANNOUNCEMENTS_PATH}/${slug}`;

// Button of the home modal
export const ctaLabels = ['Continuar', 'Ir'] as const;
// Where the button leads when no link is given: the announcement's own page
export const ctaHref = (announcement: Announcement): string => announcement.ctaUrl || newsPath(announcement.slug);
export const isExternal = (href: string): boolean => href.startsWith('https://');
export const CTA_URL_PATTERN = /^(\/([^/].*)?|https:\/\/\S+)$/;

// <input type="datetime-local"> works in the browser's time zone: ISO <-> "YYYY-MM-DDTHH:mm"
export const toLocalInput = (iso: string | null): string => {
  if (!iso) return '';
  const date = new Date(iso);
  const pad = (n: number): string => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};
export const fromLocalInput = (value: string): string | null => (value ? new Date(value).toISOString() : null);

// Featured now (the modal re-checks in the browser: a cached list may hold one that just ended)
export const isFeaturedAt = (announcement: Announcement, now: number): boolean => Boolean(announcement.isPublic && announcement.featuredFrom && announcement.featuredUntil && Date.parse(announcement.featuredFrom) <= now && now < Date.parse(announcement.featuredUntil));
export const SLUG_PATTERN = /^[a-z0-9]{18}$/;

// Cache tag of the public announcements (/news); publishing from the panel refreshes it at once
export const NEWS_TAG = 'announcements';

// Images accepted as photos (ID card, account) and as announcement attachments
export const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
export const IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const PDF_TYPE = 'application/pdf';
export const PDF_MAX_BYTES = 10 * 1024 * 1024;
// joseph-api enforces the same limits (internal/core/service/announcement_service.go)
export const MAX_ATTACHMENTS = 6;
export const MAX_ATTACHMENTS_BYTES = 40 * 1024 * 1024;
export const ATTACHMENT_ACCEPT = [...IMAGE_TYPES, PDF_TYPE].join(',');

export const attachmentKindOf = (contentType: string): AttachmentKind | null => (IMAGE_TYPES.includes(contentType) ? 'image' : contentType === PDF_TYPE ? 'document' : null);

// Tab order everywhere: anuncios, comunicados, avisos
export const announcementKinds: AnnouncementKind[] = ['announcement', 'notice', 'alert'];

export const kindMeta: Record<AnnouncementKind, KindMeta> = {
  announcement: { label: 'Anuncio', plural: 'Anuncios', icon: Megaphone, className: 'bg-brand-soft text-brand' },
  notice: { label: 'Comunicado', plural: 'Comunicados', icon: Bell, className: 'bg-success/12 text-success' },
  alert: { label: 'Aviso', plural: 'Avisos', icon: TriangleAlert, className: 'bg-warning/12 text-warning' },
};

export const audienceLabels: Record<AnnouncementAudience, string> = {
  community: 'Toda la comunidad',
  students: 'Estudiantes',
  guardians: 'Apoderados',
  staff: 'Docentes y personal',
};

// "3 de noviembre de 2026" in Lima time, the same on the server and in the browser
const dateFormat = new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Lima' });
export const formatPublishedAt = (iso: string): string => dateFormat.format(new Date(iso));
const dateTimeFormat = new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: 'America/Lima' });
export const formatDateTime = (iso: string): string => dateTimeFormat.format(new Date(iso));

const sizeFormat = new Intl.NumberFormat('es-PE', { maximumFractionDigits: 1 });
export const formatBytes = (bytes: number): string => (bytes >= 1024 * 1024 ? `${sizeFormat.format(bytes / (1024 * 1024))} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`);

export const coverOf = (announcement: Announcement): AnnouncementAttachment | undefined => announcement.attachments.find(({ kind }) => kind === 'image');

// Pinned first, then newest first
export const sortAnnouncements = (items: Announcement[]): Announcement[] => [...items].sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.publishedAt.localeCompare(a.publishedAt));
