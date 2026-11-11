export const standingLabels: Record<string, string> = { approved: 'Aprobada', failed: 'Desaprobada', ongoing: 'En curso' };
export const standingClass: Record<string, string> = { approved: 'bg-success/12 text-success', failed: 'bg-destructive/12 text-destructive', ongoing: 'bg-brand/12 text-brand' };
export const internshipLabels: Record<string, string> = { ongoing: 'En curso', approved: 'Aprobada', failed: 'Desaprobada' };
export const internshipClass: Record<string, string> = { ongoing: 'bg-brand/12 text-brand', approved: 'bg-success/12 text-success', failed: 'bg-destructive/12 text-destructive' };
export const sourceLabels: Record<string, string> = { closing: 'Acta', history: 'Historial', validation: 'Convalidada', enrolled: 'Matriculada', efsrt: 'Experiencia formativa' };
export const hoursText = (v?: number): string => (v ?? 0).toLocaleString('es-PE', { maximumFractionDigits: 1 });
