import { DASHBOARD_PATH } from '@/features/protected/dashboard/data/dashboard-navigation';

export const SETTINGS_PATH = `${DASHBOARD_PATH}/settings`;
export const AUDIT_PAGE_SIZE = 50;

// Kinds of authorizing resolution (academic.authorizations.kind)
export const authorizationKindLabels: Record<string, string> = {
  creation: 'Creación y funcionamiento',
  attention_mode: 'Forma de atención',
  expansion: 'Ampliación del servicio',
  other: 'Otra resolución',
};
export const authorizationKindHints: Record<string, string> = {
  creation: 'La resolución que crea la institución y autoriza su funcionamiento.',
  attention_mode: 'Autoriza una forma de atención (presencial, semipresencial o a distancia) en un ciclo o en todos.',
  expansion: 'Amplía el servicio: nuevos ciclos, programas, turnos o locales.',
  other: 'Cualquier otra resolución que conviene tener a la mano.',
};

// Hosting of the e-learning platform (informe 6.2.1, sección IV)
export const hostingKindLabels: Record<string, string> = { hosting: 'Servicio de hosting', own_server: 'Servidor propio', other: 'Otro' };

// API role codes, as the Usuarios page names them
export const memberRoleLabels: Record<string, string> = {
  director: 'Director(a)',
  academic_coordinator: 'Coordinación académica',
  program_coordinator: 'Coordinación de programa',
  secretary: 'Secretaría',
  teacher: 'Docente',
  tutor: 'Tutor(a)',
  assistant: 'Auxiliar',
  psychologist: 'Psicología',
  special_ed_specialist: 'Especialista de educación especial',
  treasurer: 'Tesorería',
  technical_lead: 'Responsable técnico',
  superadmin: 'Plataforma',
};

// In a CEBA the tutor accompanies at a distance
export const ebaRoleOverrides: Record<string, string> = { tutor: 'Tutor(a) virtual' };

// Panel modules as the audit log names them (audit.events.module)
export const auditModuleLabels: Record<string, string> = {
  institution: 'Institución',
  users: 'Usuarios y roles',
  structure: 'Estructura académica',
  periods: 'Periodos',
};

export const auditActionLabels: Record<string, string> = {
  create: 'Creó',
  update: 'Editó',
  delete: 'Eliminó',
  status: 'Cambió estado',
  grant: 'Dio acceso',
  revoke: 'Quitó acceso',
  other: 'Otro',
};
export const auditActionClass: Record<string, string> = {
  create: 'bg-success/12 text-success',
  update: 'bg-brand-soft text-brand',
  delete: 'bg-destructive/10 text-destructive',
  status: 'bg-warning/12 text-warning',
  grant: 'bg-success/12 text-success',
  revoke: 'bg-destructive/10 text-destructive',
  other: 'bg-secondary text-muted-foreground',
};

// Names of the fields the audit log details
export const auditFieldLabels: Record<string, string> = {
  name: 'Nombre',
  shift: 'Turno',
  attentionMode: 'Forma de atención',
  program: 'Programa',
  distanceVariant: 'Modalidad a distancia',
  room: 'Ambiente',
  capacity: 'Vacantes',
  status: 'Estado',
  role: 'Rol',
  pending: 'Invitación',
};

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const URL_PATTERN = /^https?:\/\/[^\s<>"]+$/;
