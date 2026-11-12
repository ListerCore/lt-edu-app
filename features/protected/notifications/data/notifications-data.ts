import { Bell, CalendarClock, ClipboardCheck, ClipboardList, Handshake, HeartPulse, IdCard, Settings, Wallet } from 'lucide';
import type { AppNotification, NotificationKind, NotificationKindMeta, NotificationSeed, TimelineGroup } from '../types';

export const NOTIFICATIONS_PATH = '/dashboard/notifications';

export const notificationKindMeta: Record<NotificationKind, NotificationKindMeta> = {
  announcement: { label: 'Comunicado', icon: Bell, className: 'bg-brand-soft text-brand' },
  grade: { label: 'Notas', icon: ClipboardCheck, className: 'bg-success/12 text-success' },
  attendance: { label: 'Asistencia', icon: CalendarClock, className: 'bg-warning/12 text-warning' },
  payment: { label: 'Pagos', icon: Wallet, className: 'bg-chart-2/15 text-chart-2' },
  enrollment: { label: 'Matrícula', icon: ClipboardList, className: 'bg-brand-soft text-brand' },
  wellbeing: { label: 'Bienestar', icon: HeartPulse, className: 'bg-destructive/10 text-destructive' },
  card: { label: 'Carnets', icon: IdCard, className: 'bg-accent text-foreground' },
  apafa: { label: 'APAFA', icon: Handshake, className: 'bg-success/12 text-success' },
  system: { label: 'Sistema', icon: Settings, className: 'bg-accent text-muted-foreground' },
};

const HOUR = 60;
const DAY = 24 * HOUR;

// Simulated feed; each role sees only its own (joseph-api will push the real ones)
export const notificationSeeds: NotificationSeed[] = [
  { id: 'nt01', kind: 'announcement', title: 'Nuevo comunicado: horario del periodo', body: 'Ya está disponible el horario del periodo en curso.', minutesAgo: 12, href: '/dashboard/announcements' },
  { id: 'nt02', kind: 'grade', title: 'Se publicaron las notas de Matemática', body: 'Revisa tu avance y lo que falta lograr en la evaluación 2.', minutesAgo: 45, href: '/dashboard/evaluation/grades', roles: ['student', 'guardian'] },
  { id: 'nt03', kind: 'attendance', title: 'Tardanza registrada hoy a las 8:12 a. m.', body: 'Puedes justificarla dentro de las 48 horas desde el panel.', minutesAgo: 95, href: '/dashboard/attendance/students', roles: ['student', 'guardian'] },
  { id: 'nt04', kind: 'attendance', title: '3 estudiantes acumulan 3 faltas esta semana', body: 'Revisa la lista y coordina con los tutores de sección.', minutesAgo: 2 * HOUR + 10, href: '/dashboard/attendance/students', roles: ['director', 'coordinator', 'tutor', 'assistant'] },
  { id: 'nt05', kind: 'wellbeing', title: 'Nueva derivación a psicología', body: 'El tutor de 3.° B derivó a un estudiante para entrevista.', minutesAgo: 3 * HOUR, href: '/dashboard/psychology', roles: ['psychologist', 'tutor'] },
  { id: 'nt06', kind: 'payment', title: '12 pensiones vencidas este mes', body: 'El reporte de deudas ya está listo para exportar.', minutesAgo: 5 * HOUR, href: '/dashboard/payments', roles: ['treasurer', 'director'], management: 'private' },
  { id: 'nt06p', kind: 'payment', title: '12 cuotas de la APAFA vencidas este mes', body: 'El reporte de deudas ya está listo para exportar.', minutesAgo: 5 * HOUR, href: '/dashboard/payments', roles: ['treasurer', 'director'], management: 'public' },
  { id: 'nt07', kind: 'grade', title: 'El registro de notas cierra el viernes', body: 'Completa las notas pendientes de tus secciones antes del cierre.', minutesAgo: DAY + 2 * HOUR, href: '/dashboard/evaluation/grades', roles: ['teacher', 'tutor', 'coordinator'] },
  { id: 'nt08', kind: 'payment', title: 'Vence la pensión de noviembre el día 30', body: 'Paga antes del vencimiento para evitar la mora.', minutesAgo: DAY + 4 * HOUR, href: '/dashboard/payments', roles: ['guardian'], management: 'private' },
  { id: 'nt08p', kind: 'payment', title: 'Vence la cuota de la APAFA el día 30', body: 'Puedes pagarla en tesorería, por transferencia, Yape o Plin.', minutesAgo: DAY + 4 * HOUR, href: '/dashboard/payments', roles: ['guardian'], management: 'public' },
  // APAFA meetings (public institutions only): the convocatoria for families, the pending acta for the office
  { id: 'nt08a', kind: 'apafa', title: 'Convocatoria APAFA: reunión ordinaria de fin de año', body: 'Sábado a las 6:00 p. m. en el patio central. Revisa la agenda y los documentos.', minutesAgo: DAY + 5 * HOUR, href: '/dashboard/apafa', roles: ['guardian'], management: 'public' },
  { id: 'nt08b', kind: 'apafa', title: 'Una reunión de la APAFA espera su acta', body: 'Marca la reunión como realizada y adjunta el acta firmada.', minutesAgo: DAY + 5 * HOUR, href: '/dashboard/apafa', roles: ['director', 'secretary'], management: 'public' },
  { id: 'nt09', kind: 'enrollment', title: '2 nuevas solicitudes de matrícula', body: 'Revisa los documentos y confirma las vacantes.', minutesAgo: DAY + 6 * HOUR, href: '/dashboard/enrollment', roles: ['secretary', 'director'] },
  { id: 'nt10', kind: 'card', title: 'Tu carnet está listo para descargar', body: 'Descárgalo en formato carnet, fotocheck o grande.', minutesAgo: 2 * DAY + 3 * HOUR, href: '/dashboard/cards', roles: ['student', 'teacher', 'tutor', 'secretary'] },
  { id: 'nt11', kind: 'system', title: 'Mantenimiento programado el sábado', body: 'De 22:00 a 23:00 no podrás ingresar a tu cuenta.', minutesAgo: 3 * DAY, href: '/dashboard/announcements' },
  { id: 'nt12', kind: 'announcement', title: 'Reunión general de coordinación', body: 'Viernes a las 4:00 p. m. en la sala de profesores.', minutesAgo: 4 * DAY + 5 * HOUR, href: '/dashboard/announcements', roles: ['director', 'coordinator', 'secretary', 'teacher', 'tutor', 'assistant', 'psychologist', 'treasurer'] },
];

const MINUTE_MS = 60_000;

// "hace 5 min", "hace 3 h" or the time of day for older items
const timeFormat = new Intl.DateTimeFormat('es-PE', { hour: 'numeric', minute: '2-digit' });
const dayFormat = new Intl.DateTimeFormat('es-PE', { weekday: 'long', day: 'numeric', month: 'long' });

export const relativeTime = (createdAt: number, now: number): string => {
  const minutes = Math.max(0, Math.round((now - createdAt) / MINUTE_MS));
  if (minutes < 1) return 'ahora';
  if (minutes < 60) return `hace ${minutes} min`;
  if (minutes < 6 * 60) return `hace ${Math.floor(minutes / 60)} h`;
  return timeFormat.format(createdAt);
};

const startOfDay = (time: number): number => {
  const date = new Date(time);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

// Newest first, bucketed into Hoy, Ayer and one group per older day
export const groupByDay = (items: AppNotification[], now: number): TimelineGroup[] => {
  const today = startOfDay(now);
  const yesterday = today - 24 * 60 * MINUTE_MS;
  const groups = new Map<string, AppNotification[]>();
  for (const item of [...items].sort((a, b) => b.createdAt - a.createdAt)) {
    const day = startOfDay(item.createdAt);
    const label = day === today ? 'Hoy' : day === yesterday ? 'Ayer' : dayFormat.format(item.createdAt);
    groups.set(label, [...(groups.get(label) ?? []), item]);
  }
  return [...groups].map(([label, groupItems]) => ({ label: label.charAt(0).toUpperCase() + label.slice(1), items: groupItems }));
};
