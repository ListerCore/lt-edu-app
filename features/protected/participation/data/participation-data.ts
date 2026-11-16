import { DASHBOARD_PATH } from '@/features/protected/dashboard/data/dashboard-navigation';

export const PERMANENCE_PATH = `${DASHBOARD_PATH}/attendance/permanence`;

export const variantLabels: Record<string, string> = { virtual: 'Virtual', itinerant: 'Itinerante' };
export const statusLabels: Record<string, string> = { active: '', withdrawn: 'Retirado', transferred: 'Trasladado', completed: 'Concluyó' };

const dayFormat = new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'short', timeZone: 'UTC' });
const stampFormat = new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'America/Lima' });

// "16 mar" for a YYYY-MM-DD date
export const shortDay = (iso: string): string => (iso ? dayFormat.format(new Date(`${iso}T00:00:00Z`)) : '');
// "14 nov, 19:42" for an RFC 3339 stamp
export const stamp = (iso: string): string => (iso ? stampFormat.format(new Date(iso)) : 'Sin actividad');

// Colour of a permanence percent against the institution's floor
export const percentClass = (percent: number, low: number): string => (percent >= low ? 'text-success' : percent >= low / 2 ? 'text-warning' : 'text-destructive');
