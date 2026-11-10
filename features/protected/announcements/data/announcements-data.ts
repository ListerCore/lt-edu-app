import { Bell, Megaphone, TriangleAlert } from 'lucide';
import type { Announcement, AnnouncementAttachment, AnnouncementAudience, AnnouncementKind, AttachmentKind, KindMeta } from '../types';

export const ANNOUNCEMENTS_PATH = '/dashboard/announcements';
export const NEWS_PATH = '/news';
export const newsPath = (slug: string): string => `${NEWS_PATH}/${slug}`;
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

const sizeFormat = new Intl.NumberFormat('es-PE', { maximumFractionDigits: 1 });
export const formatBytes = (bytes: number): string => (bytes >= 1024 * 1024 ? `${sizeFormat.format(bytes / (1024 * 1024))} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`);

export const coverOf = (announcement: Announcement): AnnouncementAttachment | undefined => announcement.attachments.find(({ kind }) => kind === 'image');

// Pinned first, then newest first
export const sortAnnouncements = (items: Announcement[]): Announcement[] => [...items].sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.publishedAt.localeCompare(a.publishedAt));
