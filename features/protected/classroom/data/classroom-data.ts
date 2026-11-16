import { CalendarClock, FileText, Link2, ListChecks, Paperclip, PlayCircle } from 'lucide';
import { DASHBOARD_PATH } from '@/features/protected/dashboard/data/dashboard-navigation';
import type { ItemKindMeta } from '../types';

export const CLASSROOM_PATH = `${DASHBOARD_PATH}/classroom`;
export const LIBRARY_PATH = `${CLASSROOM_PATH}/library`;
export const roomPath = (id: string): string => `${CLASSROOM_PATH}/${id}`;
export const unitPrintPath = (roomId: string, unitId: string): string => `/print/classroom/${roomId}?unit=${unitId}`;

export const LIVE_OPENS_BEFORE_MIN = 15;

// Kinds of material (classroom.items.kind), in the order the picker lists them
export const itemKinds: Record<string, ItemKindMeta> = {
  reading: { label: 'Lectura', icon: FileText, hint: 'Texto que el estudiante lee aquí mismo.' },
  file: { label: 'Archivo', icon: Paperclip, hint: 'PDF, imágenes, Word o Excel que se adjuntan después de guardar.' },
  video: { label: 'Video', icon: PlayCircle, hint: 'Enlace a un video (YouTube, PerúEduca, Drive).' },
  link: { label: 'Enlace web', icon: Link2, hint: 'Una página educativa en internet.' },
  live: { label: 'Sesión en vivo', icon: CalendarClock, hint: 'Videollamada con fecha y hora; la asistencia se registra al entrar desde aquí.' },
  activity: { label: 'Actividad', icon: ListChecks, hint: 'Indicaciones de un trabajo para la semana.' },
};

// The library keeps reusable material only (no sessions or activities)
export const libraryKinds = ['reading', 'file', 'video', 'link'];

export const roomStatusLabels: Record<string, string> = { draft: 'Borrador', published: 'Publicada' };
export const roomStatusClass: Record<string, string> = { draft: 'bg-secondary text-muted-foreground', published: 'bg-success/12 text-success' };

export const HTTPS_PATTERN = /^https:\/\/[^\s<>"]+$/;

// Categories a teacher picks when attaching files to material
export const materialCategories = ['material', 'guide', 'worksheet', 'presentation', 'other'] as const;

// Lima has no daylight saving: UTC-5 all year
const LIMA_OFFSET_MS = 5 * 60 * 60 * 1000;

// "2026-11-20T19:00" in Lima → RFC 3339 UTC; empty when not a full date and time
export const limaLocalToIso = (local: string): string => {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(local)) return '';
  return new Date(Date.parse(`${local}:00Z`) + LIMA_OFFSET_MS).toISOString();
};

// RFC 3339 → "2026-11-20T19:00" in Lima, for a datetime-local input
export const isoToLimaLocal = (iso: string): string => {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return '';
  return new Date(t - LIMA_OFFSET_MS).toISOString().slice(0, 16);
};

const liveFormat = new Intl.DateTimeFormat('es-PE', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', timeZone: 'America/Lima' });
export const formatLive = (iso: string): string => liveFormat.format(new Date(iso));
