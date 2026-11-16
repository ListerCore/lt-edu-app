import { CalendarClock, ClipboardCheck, FilePen, FileText, Link2, ListChecks, MessagesSquare, Paperclip, PlayCircle } from 'lucide';
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
  quiz: { label: 'Cuestionario', icon: ClipboardCheck, hint: 'Preguntas que el estudiante responde en línea; las cerradas se califican solas. Configúralo después de crearlo.' },
  forum: { label: 'Foro', icon: MessagesSquare, hint: 'Un espacio para conversar sobre la unidad. Escribe la pregunta o la consigna en las indicaciones.' },
  task: { label: 'Tarea', icon: FilePen, hint: 'Un trabajo que el estudiante entrega con archivos. Configura fechas y competencias después de crearlo.' },
};

export const forumPath = (roomId: string, itemId: string): string => `${CLASSROOM_PATH}/${roomId}/forums/${itemId}`;

export const forumKindLabels: Record<string, string> = { debate: 'Debate', questions: 'Consultas al docente', intro: 'Presentación' };
export const forumKindHints: Record<string, string> = {
  debate: 'Una pregunta para discutir entre todos.',
  questions: 'Dudas sobre la unidad; el docente responde.',
  intro: 'Cada estudiante se presenta al grupo.',
};
// Roles that read as staff in a forum thread
export const staffAuthorRoles = ['teacher', 'tutor', 'director', 'academic_coordinator', 'superadmin'];

export const assessmentPath = (roomId: string, itemId: string): string => `${CLASSROOM_PATH}/${roomId}/assessments/${itemId}`;

export const questionKindLabels: Record<string, string> = { single: 'Una respuesta', multiple: 'Varias respuestas', short: 'Respuesta corta', open: 'Respuesta abierta' };
export const submissionStatusLabels: Record<string, string> = { in_progress: 'Respondiendo', submitted: 'Por calificar', graded: 'Calificado' };
export const submissionStatusClass: Record<string, string> = { in_progress: 'bg-secondary text-muted-foreground', submitted: 'bg-warning/12 text-warning', graded: 'bg-success/12 text-success' };
export const LEVELS = ['AD', 'A', 'B', 'C'];
export const levelClass: Record<string, string> = { AD: 'bg-success/15 text-success', A: 'bg-brand-soft text-brand', B: 'bg-warning/12 text-warning', C: 'bg-destructive/10 text-destructive' };
export const submissionCategories = ['evidence', 'worksheet', 'material', 'other'] as const;

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
