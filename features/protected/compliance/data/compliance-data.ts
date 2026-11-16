import type { AttachmentCategory } from '@/features/protected/attachments/types';

export const deviceKindLabels: Record<string, string> = { desktop: 'Computadora', laptop: 'Laptop', tablet: 'Tableta', network: 'Equipo de red', printer: 'Impresora', other: 'Otro' };
export const purposeLabels: Record<string, string> = { virtual_tutoring: 'Tutoría virtual', student_support: 'Soporte a estudiantes', administration: 'Administración', shared: 'Compartido' };
export const deviceStatusLabels: Record<string, string> = { operational: 'Operativo', pending: 'Pendiente' };
export const linkKindLabels: Record<string, string> = { fiber: 'Fibra óptica', adsl: 'ADSL', wireless: 'Inalámbrica', mobile: 'Móvil', other: 'Otra' };
export const checkKindLabels: Record<string, string> = { connectivity: 'Conectividad', platform_access: 'Acceso a la plataforma' };

export const itemStatusLabels: Record<string, string> = { pending: 'Pendiente', verified: 'Verificado', not_applicable: 'No aplica' };
export const itemStatusClass: Record<string, string> = {
  pending: 'bg-warning/12 text-warning',
  verified: 'bg-success/12 text-success',
  not_applicable: 'bg-secondary text-muted-foreground',
};
export const sectionLabels: Record<string, string> = { informative: '5.1. Sección informativa', classroom: '5.2. Sección de aula virtual', equipment: 'VII. Resultados de la verificación' };

export const reportTitles: Record<string, { title: string; norm: string }> = {
  platform: { title: 'Plataforma e-learning', norm: 'RSG 613-2014-MINEDU, numeral 6.2.1 y Anexo 2' },
  equipment: { title: 'Equipos para tutores virtuales', norm: 'RSG 613-2014-MINEDU, numeral 6.3.2, literal c)' },
};

// Evidence categories of each record (joseph-api attachment_service.go ownerSpecs)
export const evidenceCategories: AttachmentCategory[] = ['screenshot', 'report', 'other'];
export const roomCategories: AttachmentCategory[] = ['photo', 'plan', 'other'];
export const deviceCategories: AttachmentCategory[] = ['photo', 'certificate', 'report', 'other'];

const instant = new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'America/Lima' });
export const formatInstant = (iso: string): string => (iso ? instant.format(new Date(iso)) : '');
