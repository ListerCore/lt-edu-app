import { DASHBOARD_PATH } from '@/features/protected/dashboard/data/dashboard-navigation';
import type { Tally } from '../types';

export const STUDENT_ATTENDANCE_PATH = `${DASHBOARD_PATH}/attendance/students`;
export const STAFF_ATTENDANCE_PATH = `${DASHBOARD_PATH}/attendance/staff`;

export const markOrder = ['present', 'late', 'absent', 'justified'] as const;

export const markLabels: Record<string, string> = { present: 'Presente', late: 'Tardanza', absent: 'Falta', justified: 'Justificada', '': 'Sin marcar' };
// One letter for the dense rosters, the way paper registers mark them
export const markLetters: Record<string, string> = { present: 'P', late: 'T', absent: 'F', justified: 'J' };
export const markClass: Record<string, string> = {
  present: 'bg-success/12 text-success',
  late: 'bg-warning/14 text-warning',
  absent: 'bg-destructive/12 text-destructive',
  justified: 'bg-brand/12 text-brand',
  '': 'bg-secondary text-muted-foreground',
};
// The filled state of a selected mark button
export const markSolid: Record<string, string> = {
  present: 'bg-success text-white border-success',
  late: 'bg-warning text-white border-warning',
  absent: 'bg-destructive text-white border-destructive',
  justified: 'bg-brand text-brand-foreground border-brand',
};
export const markBar: Record<string, string> = { present: 'bg-success', late: 'bg-warning', absent: 'bg-destructive', justified: 'bg-brand' };

export const sourceLabels: Record<string, string> = { gate: 'Carnet en puerta', manual: 'A mano', closing: 'Al cerrar el día', justification: 'Por justificación' };

export const reasonLabels: Record<string, string> = { health: 'Salud', family: 'Asunto familiar', procedure: 'Trámite', other: 'Otro motivo' };
export const justificationLabels: Record<string, string> = { pending: 'Por revisar', approved: 'Aceptada', rejected: 'Observada' };
export const justificationClass: Record<string, string> = { pending: 'bg-warning/14 text-warning', approved: 'bg-success/12 text-success', rejected: 'bg-destructive/12 text-destructive' };

export const tallyTotal = (t?: Tally): number => (t ? t.present + t.late + t.absent + t.justified : 0);
export const absentPercent = (t?: Tally): number => {
  const total = tallyTotal(t);
  return total === 0 || !t ? 0 : (t.absent * 100) / total;
};
export const attendedPercent = (t?: Tally): number => {
  const total = tallyTotal(t);
  return total === 0 || !t ? 0 : ((t.present + t.late) * 100) / total;
};

const clock = new Intl.DateTimeFormat('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Lima' });
// RFC 3339 instant → "07:52" in Lima
export const formatClock = (value: string): string => (value ? clock.format(new Date(value)) : '');

const weekday = new Intl.DateTimeFormat('es-PE', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });
export const formatLongDay = (value: string): string => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const text = weekday.format(new Date(`${value}T00:00:00Z`));
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const shiftDay = (value: string, days: number): string => {
  const d = new Date(`${value}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};

export const percent = (value: number): string => `${value.toLocaleString('es-PE', { maximumFractionDigits: 1 })} %`;
