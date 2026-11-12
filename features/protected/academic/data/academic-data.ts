import { DASHBOARD_PATH } from '@/features/protected/dashboard/data/dashboard-navigation';
import type { InstitutionType } from '@/features/protected/dashboard/types';

export const STRUCTURE_PATH = `${DASHBOARD_PATH}/academic/structure`;
export const PERIODS_PATH = `${DASHBOARD_PATH}/academic/periods`;
export const ATTENTION_MODES_PATH = `${DASHBOARD_PATH}/academic/attention-modes`;
export const periodPath = (id: string): string => `${PERIODS_PATH}/${id}`;

export const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
export const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
export const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// The Joseph demo institution of each type; the platform superadmin opens it from the workspace selector.
// People with an institution role always see their own institution, whatever this says
export const demoInstitutionSlugs: Record<InstitutionType, string> = {
  EBR: 'demo-ebr',
  EBA: 'demo-eba',
  EBE: 'demo-ebe',
  CEPRE: 'demo-cepre',
  IEST: 'demo-institute',
};

export const ALL_SHIFTS = ['morning', 'afternoon', 'evening'];
export const ALL_ATTENTION_MODES = ['in_person', 'blended', 'distance'];

export const shiftLabels: Record<string, string> = { morning: 'Mañana', afternoon: 'Tarde', evening: 'Noche' };
export const attentionModeLabels: Record<string, string> = { in_person: 'Presencial', blended: 'Semipresencial', distance: 'A distancia' };
export const attentionModeHints: Record<string, string> = {
  in_person: 'Clases en el local, en el horario de la sección.',
  blended: 'Parte presencial y parte con tutoría y material para avanzar en casa.',
  distance: 'Estudio autónomo con material y asesorías. La norma la permite solo en el ciclo avanzado.',
};
export const seasonLabels: Record<string, string> = {
  summer: 'Verano',
  annual: 'Anual',
  semester: 'Semestral',
  intensive: 'Intensivo',
  review: 'Repaso',
  school: 'Escolar',
  other: 'Otro',
};
// Tipo de gestión of the institution and what each one means for payments
export const managementLabels: Record<string, string> = { private: 'Privada', public: 'Pública' };
export const managementHints: Record<string, string> = {
  private: 'Cobra matrícula, pensiones y otros conceptos.',
  public: 'No cobra pensiones: las familias solo pagan la matrícula y la cuota de la APAFA.',
};
export const termSchemeLabels: Record<string, string> = { bimester: 'Bimestres', trimester: 'Trimestres', semester: 'Semestres', none: 'Sin división' };
export const termSchemeHints: Record<string, string> = {
  bimester: 'Cuatro bimestres, con informe de progreso al final de cada uno.',
  trimester: 'Tres trimestres, con informe de progreso al final de cada uno.',
  semester: 'Dos semestres, con informe de progreso al final de cada uno.',
  none: 'El periodo no se divide: se evalúa a lo largo y al cierre.',
};
export const formativeLevelLabels: Record<string, string> = { technical: 'Técnico', professional_technical: 'Profesional técnico', professional: 'Profesional' };
export const gradingScaleLabels: Record<string, string> = {
  literal: 'AD, A, B y C por competencia',
  vigesimal: 'Vigesimal, de 0 a 20',
  score: 'Puntaje de simulacros y ranking',
};
export const periodStatusLabels: Record<string, string> = { planning: 'En planificación', active: 'En curso', closed: 'Cerrado' };
export const periodStatusClass: Record<string, string> = {
  planning: 'bg-secondary text-muted-foreground',
  active: 'bg-success/12 text-success',
  closed: 'bg-brand-soft text-brand',
};
export const termStatusLabels: Record<string, string> = { open: 'Abierto', closed: 'Cerrado' };

const longDate = new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const shortDate = new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'short', timeZone: 'UTC' });

// Dates travel as YYYY-MM-DD; shown in Peruvian Spanish without shifting the day
export const formatDay = (value: string, withYear = true): string => {
  if (!DATE_PATTERN.test(value)) return value;
  return (withYear ? longDate : shortDate).format(new Date(`${value}T00:00:00Z`));
};

export const formatRange = (from: string, to: string): string => `${formatDay(from, from.slice(0, 4) !== to.slice(0, 4))} – ${formatDay(to)}`;

export const daysBetween = (from: string, to: string): number => Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000) + 1;

// Today's position inside a date range, from 0 to 1 (null outside it)
export const progressOf = (from: string, to: string, today: string): number | null => {
  if (today < from || today > to) return null;
  return Math.min(1, Math.max(0, (daysBetween(from, today) - 1) / Math.max(1, daysBetween(from, to) - 1)));
};

export const todayISO = (now = new Date()): string => `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

// "A, B, C" or one per line → ["A", "B", "C"]
export const splitNames = (value: string): string[] => [...new Set(value.split(/[,;\n]+/).map((name) => name.trim()).filter(Boolean))];

export const lower = (value: string): string => value.charAt(0).toLowerCase() + value.slice(1);

export const items = (labels: Record<string, string>, keys: string[] = Object.keys(labels)): Array<{ value: string; label: string }> => keys.map((value) => ({ value, label: labels[value] ?? value }));

// The name a new period suggests for the institution type
export const suggestedPeriodName = (periodKind: string, season: string, year: number): string => {
  switch (periodKind) {
    case 'school_year':
      return `Año lectivo ${year}`;
    case 'promotional':
      return `Periodo promocional ${year}`;
    case 'semester':
      return `Semestre ${year}-I`;
    default:
      return `Ciclo ${seasonLabels[season] ?? ''} ${year}`.replace(/\s+/g, ' ');
  }
};

// ---------- study plans ----------

export const CURRICULA_PATH = `${DASHBOARD_PATH}/academic/courses`;
export const curriculumPath = (id: string): string => `${CURRICULA_PATH}/${id}`;

export const curriculumStatusLabels: Record<string, string> = { draft: 'Borrador', active: 'Vigente', archived: 'Archivado' };
export const curriculumStatusClass: Record<string, string> = {
  draft: 'bg-secondary text-muted-foreground',
  active: 'bg-success/12 text-success',
  archived: 'bg-brand-soft text-brand',
};

export const subjectKindLabels: Record<string, string> = {
  area: 'Área curricular',
  workshop: 'Taller',
  tutoring: 'Tutoría',
  course: 'Curso',
  unit: 'Unidad didáctica',
  efsrt: 'Experiencia formativa (EFSRT)',
};
export const componentLabels: Record<string, string> = { specific: 'Específica', employability: 'Empleabilidad', efsrt: 'EFSRT' };
export const componentClass: Record<string, string> = {
  specific: 'bg-secondary text-foreground',
  employability: 'bg-brand-soft text-brand',
  efsrt: 'bg-success/12 text-success',
};

// Subject kinds each institution kind uses (same rule as the API), the first being the default
export const subjectKindsFor: Record<string, string[]> = {
  ebr: ['area', 'workshop', 'tutoring'],
  eba: ['area', 'workshop', 'tutoring'],
  ebe: ['area', 'workshop', 'tutoring'],
  cepre: ['course'],
  institute: ['unit', 'efsrt'],
};

// What is assessed: competencies (Educación Básica), capacities (institutes), topics (CEPRE)
export const assessedNoun: Record<string, { one: string; many: string }> = {
  ebr: { one: 'Competencia', many: 'Competencias' },
  eba: { one: 'Competencia', many: 'Competencias' },
  ebe: { one: 'Competencia', many: 'Competencias' },
  cepre: { one: 'Tema', many: 'Temas' },
  institute: { one: 'Capacidad', many: 'Capacidades' },
};

export const subjectNoun: Record<string, { one: string; many: string }> = {
  ebr: { one: 'Área', many: 'Áreas' },
  eba: { one: 'Área', many: 'Áreas' },
  ebe: { one: 'Área', many: 'Áreas' },
  cepre: { one: 'Curso', many: 'Cursos' },
  institute: { one: 'Unidad didáctica', many: 'Unidades didácticas' },
};

export const creditsOf = (subject: { theoryCredits?: number; practiceCredits?: number }): number => (subject.theoryCredits ?? 0) + (subject.practiceCredits ?? 0);

// ---------- week ----------

export const weekdayLabels: Record<string, string> = { '1': 'Lunes', '2': 'Martes', '3': 'Miércoles', '4': 'Jueves', '5': 'Viernes', '6': 'Sábado', '7': 'Domingo' };
export const weekdayShort: Record<string, string> = { '1': 'Lun', '2': 'Mar', '3': 'Mié', '4': 'Jue', '5': 'Vie', '6': 'Sáb', '7': 'Dom' };
export const SCHEDULES_PATH = `${DASHBOARD_PATH}/academic/schedules`;
