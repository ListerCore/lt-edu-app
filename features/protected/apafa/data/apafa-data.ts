import { DASHBOARD_PATH } from '@/features/protected/dashboard/data/dashboard-navigation';
import { soles } from '@/features/protected/finance/data/finance-data';
import type { BoardMember, BoardMemberView, Fees, FeesView, Meeting, MeetingView } from '../types';

export const APAFA_PATH = `${DASHBOARD_PATH}/apafa`;
export const meetingPath = (id: string): string => `${APAFA_PATH}/${id}`;

// Spanish names of the meeting kinds, statuses, modalities, audiences and board offices
export const kindLabels: Record<string, string> = { ordinary: 'Reunión ordinaria', extraordinary: 'Reunión extraordinaria', assembly: 'Asamblea general', board: 'Consejo directivo' };
export const statusLabels: Record<string, string> = { scheduled: 'Convocada', rescheduled: 'Reprogramada', held: 'Realizada', cancelled: 'Cancelada' };
export const statusClass: Record<string, string> = {
  scheduled: 'bg-brand/12 text-brand',
  rescheduled: 'bg-warning/14 text-warning',
  held: 'bg-success/12 text-success',
  cancelled: 'bg-destructive/12 text-destructive',
};
export const draftLabel = 'Sin convocar';
export const draftClass = 'bg-secondary text-muted-foreground';
export const modalityLabels: Record<string, string> = { in_person: 'Presencial', virtual: 'Virtual', hybrid: 'Presencial y virtual' };
export const audienceLabels: Record<string, string> = { guardians: 'Todas las familias', community: 'Toda la comunidad educativa' };
export const positionLabels: Record<string, string> = { president: 'Presidencia', vice_president: 'Vicepresidencia', secretary: 'Secretaría', treasurer: 'Tesorería', spokesperson: 'Vocal' };

// Attachment categories offered on a meeting, in the order a secretary uses them
export const meetingCategories = ['agenda', 'minutes', 'financial_statement', 'attendance_list', 'report', 'other'] as const;

// Peru keeps UTC-5 all year (no daylight saving), so a Lima wall time maps to a fixed offset
const LIMA_OFFSET = '-05:00';
const LIMA = 'America/Lima';

const whenFormat = new Intl.DateTimeFormat('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: LIMA });
const timeFormat = new Intl.DateTimeFormat('es-PE', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: LIMA });
const dayFormat = new Intl.DateTimeFormat('es-PE', { day: 'numeric', timeZone: LIMA });
const monthFormat = new Intl.DateTimeFormat('es-PE', { month: 'short', timeZone: LIMA });
const shortFormat = new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'short', year: 'numeric', timeZone: LIMA });
const partsFormat = new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: LIMA });

const valid = (iso: string): Date | null => {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
};

// "jueves, 28 de noviembre de 2026"
export const formatWhen = (iso: string): string => {
  const d = valid(iso);
  return d ? whenFormat.format(d) : '';
};

// "6:00 p. m."
export const formatTime = (iso: string): string => {
  const d = valid(iso);
  return d ? timeFormat.format(d) : '';
};

export const formatDayNumber = (iso: string): string => {
  const d = valid(iso);
  return d ? dayFormat.format(d) : '';
};

export const formatMonthShort = (iso: string): string => {
  const d = valid(iso);
  return d ? monthFormat.format(d).replace('.', '') : '';
};

// "12 nov 2026"
export const formatShort = (iso: string): string => {
  const d = valid(iso);
  return d ? shortFormat.format(d) : '';
};

// "2026-03-01" → "1 mar 2026" (a calendar day: read at Lima noon so no offset moves it)
export const formatDay = (day: string): string => (day ? shortFormat.format(new Date(`${day}T12:00:00${LIMA_OFFSET}`)) : '');

// ISO instant → datetime-local value in Lima wall time ("2026-11-28T18:00")
export const toLimaInput = (iso: string): string => {
  const d = valid(iso);
  if (!d) return '';
  const p = Object.fromEntries(partsFormat.formatToParts(d).map((part) => [part.type, part.value]));
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
};

// datetime-local value (Lima wall time) → RFC 3339 with the Lima offset; '' when it is not a full date and time
export const fromLimaInput = (value: string): string => (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value) ? `${value}:00${LIMA_OFFSET}` : '');

// Splits the agenda or the agreements into their points (one per line), without empty lines
export const lines = (text: string): string[] =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

// ---------- views ----------

// API meeting → what the cards and the detail render; now (ms) tells whether an open meeting's time has come
export const toMeetingView = (m: Meeting, now: number): MeetingView => {
  const at = Date.parse(m.scheduledAt);
  const isOpen = m.status === 'scheduled' || m.status === 'rescheduled';
  const isDraft = isOpen && !m.notifiedAt;
  return {
    id: m.id,
    title: m.title,
    kind: m.kind,
    kindLabel: kindLabels[m.kind] ?? m.kind,
    status: m.status,
    statusLabel: isDraft ? draftLabel : (statusLabels[m.status] ?? m.status),
    statusClass: isDraft ? draftClass : (statusClass[m.status] ?? draftClass),
    isDraft,
    isOpen,
    isDue: isOpen && now > 0 && at <= now,
    dayLabel: formatDayNumber(m.scheduledAt),
    monthLabel: formatMonthShort(m.scheduledAt),
    whenLabel: formatWhen(m.scheduledAt),
    timeLabel: formatTime(m.scheduledAt),
    previousLabel: m.previousAt ? `${formatWhen(m.previousAt)}, ${formatTime(m.previousAt)}` : '',
    modality: m.modality,
    modalityLabel: modalityLabels[m.modality] ?? m.modality,
    place: m.place,
    meetingUrl: m.meetingUrl,
    audience: m.audience,
    audienceLabel: audienceLabels[m.audience] ?? m.audience,
    agenda: lines(m.agenda),
    rescheduleReason: m.rescheduleReason,
    cancelReason: m.cancelReason,
    minutes: m.minutes,
    agreements: lines(m.agreements),
    attendees: m.attendees,
    minutesPublished: Boolean(m.minutesPublishedAt),
    notifiedLabel: m.notifiedAt ? formatShort(m.notifiedAt) : '',
    createdName: m.createdName,
    files: m.files,
    href: meetingPath(m.id),
    raw: m,
  };
};

// Board office → its label and period; current when today falls within it
export const toBoardView = (b: BoardMember, today: string): BoardMemberView => ({
  id: b.id,
  fullName: b.fullName,
  position: b.position,
  positionLabel: positionLabels[b.position] ?? b.position,
  phone: b.phone,
  periodLabel: `${formatDay(b.startsOn)} – ${formatDay(b.endsOn)}`,
  current: today !== '' && b.startsOn <= today && today <= b.endsOn,
  raw: b,
});

export const toFeesView = (f: Fees): FeesView => ({
  expected: soles(f.expected),
  collected: soles(f.collected),
  pending: soles(f.pending),
  charged: f.charged,
  settled: f.settled,
  percent: f.expected > 0 ? Math.round((f.collected * 100) / f.expected) : 0,
});
