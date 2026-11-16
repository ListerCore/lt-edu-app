export const sessionKindLabels: Record<string, string> = { individual: 'Individual', group: 'Grupal' };
export const sessionModeLabels: Record<string, string> = { virtual: 'Virtual', in_person: 'Presencial', phone: 'Por teléfono' };
export const sessionStatusLabels: Record<string, string> = { scheduled: 'Agendada', held: 'Realizada', missed: 'No asistió', cancelled: 'Cancelada' };
export const sessionStatusClass: Record<string, string> = {
  scheduled: 'bg-brand-soft text-brand',
  held: 'bg-success/12 text-success',
  missed: 'bg-warning/12 text-warning',
  cancelled: 'bg-secondary text-muted-foreground',
};

// The precise alert of a student (dropout of E5, or a commitment past due)
export const alertCodeLabels: Record<string, string> = { inactive: 'Sin actividad', overdue: 'Entregas vencidas', low_permanence: 'Permanencia baja', commitment: 'Compromiso vencido' };
export const alertCodeClass: Record<string, string> = {
  inactive: 'bg-destructive/12 text-destructive',
  overdue: 'bg-warning/12 text-warning',
  low_permanence: 'bg-warning/12 text-warning',
  commitment: 'bg-secondary text-foreground',
};
// What a session about an alert is for, as a first reason the tutor may change
export const alertReasons: Record<string, string> = {
  inactive: 'Saber por qué dejó de conectarse y acordar cómo retomar',
  overdue: 'Ponerse al día con las entregas vencidas',
  low_permanence: 'Mejorar su permanencia en el aula virtual',
  commitment: 'Revisar el compromiso pendiente',
};

export const saaneeStatusLabels: Record<string, string> = { sent: 'Enviada', received: 'Recibida', attending: 'En atención', closed: 'Cerrada' };
export const saaneeStatusClass: Record<string, string> = {
  sent: 'bg-secondary text-foreground',
  received: 'bg-brand-soft text-brand',
  attending: 'bg-warning/12 text-warning',
  closed: 'bg-success/12 text-success',
};

const dateTime = new Intl.DateTimeFormat('es-PE', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'America/Lima' });
const time = new Intl.DateTimeFormat('es-PE', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Lima' });
const day = new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'short', timeZone: 'America/Lima' });

// "jue., 20 nov., 19:00"
export const formatWhen = (iso: string): string => (iso ? dateTime.format(new Date(iso)) : '');

// A message time: the hour today, the day otherwise
export const formatMessageTime = (iso: string, now = Date.now()): string => {
  if (!iso) return '';
  const t = new Date(iso);
  return now - t.getTime() < 20 * 3600_000 ? time.format(t) : `${day.format(t)} ${time.format(t)}`;
};

// "Hace 12 días" / "Hoy" / "Nunca"
export const idleText = (days: number | undefined, lastAt: string): string => {
  if (!lastAt) return 'Nunca entró';
  const d = days ?? 0;
  if (d <= 0) return 'Hoy';
  if (d === 1) return 'Ayer';
  return `Hace ${d} días`;
};
