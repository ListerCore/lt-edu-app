import type { AttachmentCategory } from '@/features/protected/attachments/types';

// Spanish labels of the wellbeing codes (the API sends codes; the screens show these)

export const interviewKindLabels: Record<string, string> = { student: 'Con el estudiante', family: 'Con la familia' };

export const partyLabels: Record<string, string> = { student: 'Estudiante', family: 'Familia', school: 'Colegio' };

export const commitmentStatusLabels: Record<string, string> = { pending: 'Pendiente', met: 'Cumplido', unmet: 'No cumplido' };
export const commitmentStatusClass: Record<string, string> = {
  pending: 'bg-secondary text-muted-foreground',
  met: 'bg-success/12 text-success',
  unmet: 'bg-destructive/10 text-destructive',
};

export const caseStatusLabels: Record<string, string> = { referred: 'Derivado', open: 'En atención', follow_up: 'Seguimiento', closed: 'Cerrado' };
export const caseStatusClass: Record<string, string> = {
  referred: 'bg-warning/15 text-warning',
  open: 'bg-brand/12 text-brand',
  follow_up: 'bg-secondary text-foreground',
  closed: 'bg-success/12 text-success',
};

export const originLabels: Record<string, string> = {
  tutor: 'Tutoría',
  teacher: 'Docente',
  family: 'Familia',
  direction: 'Dirección',
  self: 'El propio estudiante',
  psychologist: 'Psicología',
};

export const sessionKindLabels: Record<string, string> = { individual: 'Individual', family: 'Con la familia', evaluation: 'Evaluación', coordination: 'Coordinación' };

export const severityLabels: Record<string, string> = { minor: 'Leve', serious: 'Grave', very_serious: 'Muy grave' };
export const severityClass: Record<string, string> = {
  minor: 'bg-secondary text-muted-foreground',
  serious: 'bg-warning/15 text-warning',
  very_serious: 'bg-destructive/10 text-destructive',
};

export const measureKindLabels: Record<string, string> = {
  corrective: 'Medida correctiva',
  suspension: 'Suspensión',
  conditional: 'Matrícula condicional',
  expulsion: 'Expulsión',
};

// Grounds of each measure as DS 021-2026-MINEDU states them (the API checks the verifiable ones)
export const groundLabels: Record<string, string> = {
  serious_fault: 'Falta grave o muy grave',
  three_minor: 'Tres faltas leves en el bimestre',
  repeated_minor: 'Faltas leves reiteradas sin compromiso de cambio',
  two_suspensions: 'Dos suspensiones en el año',
  conduct: 'Nota de conducta desaprobatoria en el promedio anual',
  no_family_support: 'Sin apoyo ni compromiso de la familia',
  three_suspensions: 'Tres suspensiones en el año',
  very_serious: 'Falta muy grave que lo amerita',
  systematic: 'Reiteración sistemática que impide la permanencia',
};

export const measureGrounds: Record<string, string[]> = {
  corrective: [''],
  suspension: ['serious_fault', 'three_minor'],
  conditional: ['repeated_minor', 'two_suspensions', 'conduct', 'no_family_support'],
  expulsion: ['three_suspensions', 'very_serious', 'systematic'],
};

export const outcomeLabels: Record<string, string> = { upheld: 'Confirmada', revoked: 'Dejada sin efecto' };

export const planStatusLabels: Record<string, string> = { draft: 'Borrador', approved: 'Aprobado' };

export const therapyKindLabels: Record<string, string> = {
  language: 'Lenguaje',
  physical: 'Física',
  occupational: 'Ocupacional',
  psychomotor: 'Psicomotricidad',
  behavioral: 'Conductual',
  learning: 'Aprendizaje',
};

export const alertKindLabels: Record<string, string> = {
  attendance: 'Asistencia',
  conduct: 'Conducta',
  discipline: 'Convivencia',
  reconsideration: 'Reconsideraciones',
  commitment: 'Compromisos',
  psychology: 'Psicología',
  plan: 'POI',
  // Distance form (EBA): no activity, overdue work or low permanence
  dropout: 'Abandono',
};

// Conduct below 11 fails (DS 021-2026-MINEDU)
export const CONDUCT_PASS = 11;

// Attachments of a POI and of a therapy session, shared by the plans and therapies pages and the student's file
export const planFileCategories: AttachmentCategory[] = ['plan', 'evaluation', 'report', 'medical_report', 'other'];
export const planFilesDescription = 'El POI firmado, la evaluación psicopedagógica, informes de especialistas y certificados médicos que lo sustentan.';
export const therapyFileCategories: AttachmentCategory[] = ['report', 'evaluation', 'evidence', 'medical_report', 'other'];
export const therapyFilesDescription = 'Informes del terapeuta, evaluaciones, fotos o videos de evidencia y certificados médicos.';
