import type { LivePhase, LiveProvider, LiveSource } from '../types';

export const liveSources: LiveSource[] = ['class', 'tutoring', 'psychology'];

export const liveSourceLabels: Record<LiveSource, string> = { class: 'Clase en vivo', tutoring: 'Tutoría', psychology: 'Psicología' };

export const providerLabels: Record<LiveProvider, string> = { platform: 'En la plataforma', meet: 'Google Meet' };

export const appointmentStatusLabels: Record<string, string> = { scheduled: 'Agendada', held: 'Realizada', missed: 'No asistió', cancelled: 'Cancelada' };

export const NEW_MEET_URL = 'https://meet.google.com/new';

// Participants enter from 15 minutes before the start until 30 minutes after the end; hosts any time
const EARLY_MS = 15 * 60_000;
const LATE_MS = 30 * 60_000;

export const livePhase = (startsAt: string, durationMin: number, now: number): LivePhase => {
  const start = new Date(startsAt).getTime();
  const end = start + durationMin * 60_000;
  if (now < start - EARLY_MS) return 'upcoming';
  if (now > end + LATE_MS) return 'ended';
  return 'open';
};

export const liveHref = (source: LiveSource, id: string): string => `/dashboard/live/${source}/${id}`;

export const isLiveSource = (v: string): v is LiveSource => (liveSources as string[]).includes(v);

const timeFormat = new Intl.DateTimeFormat('es-PE', { timeZone: 'America/Lima', hour: '2-digit', minute: '2-digit' });
const dayFormat = new Intl.DateTimeFormat('es-PE', { timeZone: 'America/Lima', weekday: 'long', day: 'numeric', month: 'long' });
const limaDay = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Lima', year: 'numeric', month: '2-digit', day: '2-digit' });

export const liveTime = (iso: string): string => timeFormat.format(new Date(iso));
export const liveDay = (iso: string): string => dayFormat.format(new Date(iso));
// "2026-11-20" in Lima, to group by day
export const limaDate = (iso: string | number): string => limaDay.format(new Date(iso));
