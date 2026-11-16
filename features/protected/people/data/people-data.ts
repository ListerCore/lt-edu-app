import { DASHBOARD_PATH } from '@/features/protected/dashboard/data/dashboard-navigation';

export const STUDENTS_PATH = `${DASHBOARD_PATH}/students`;
export const NEW_STUDENT_PATH = `${STUDENTS_PATH}/new`;
export const studentPath = (id: string): string => `${STUDENTS_PATH}/${id}`;
export const ENROLLMENT_PATH = `${DASHBOARD_PATH}/enrollment`;
export const PLACEMENT_PATH = `${ENROLLMENT_PATH}/placement`;
export const ROLL_PATH = `${ENROLLMENT_PATH}/roll`;

export const PAGE_SIZE = 25;

export const documentTypeLabels: Record<string, string> = { dni: 'DNI', ce: 'Carné de extranjería', passport: 'Pasaporte', other: 'Otro' };
export const sexLabels: Record<string, string> = { f: 'Femenino', m: 'Masculino' };
export const relationshipLabels: Record<string, string> = { mother: 'Madre', father: 'Padre', legal_guardian: 'Tutor legal', grandparent: 'Abuelo(a)', sibling: 'Hermano(a)', other: 'Otro' };

export const studentStatusLabels: Record<string, string> = { active: 'Activo', inactive: 'Inactivo', graduated: 'Egresado', withdrawn: 'Retirado' };
export const studentStatusClass: Record<string, string> = {
  active: 'bg-success/12 text-success',
  inactive: 'bg-secondary text-muted-foreground',
  graduated: 'bg-brand-soft text-brand',
  withdrawn: 'bg-warning/12 text-warning',
};

export const enrollmentKindLabels: Record<string, string> = { new: 'Nuevo ingreso', continuing: 'Continuador', transfer_in: 'Traslado de otra institución', re_entry: 'Reingreso' };
export const enrollmentStatusLabels: Record<string, string> = { active: 'Matriculado', withdrawn: 'Retirado', transferred: 'Trasladado', completed: 'Concluido' };
export const enrollmentStatusClass: Record<string, string> = {
  active: 'bg-success/12 text-success',
  withdrawn: 'bg-warning/12 text-warning',
  transferred: 'bg-brand-soft text-brand',
  completed: 'bg-secondary text-muted-foreground',
};

export const accessLabels: Record<string, string> = { none: 'Sin acceso', invited: 'Invitado', account: 'Con cuenta' };
export const accessClass: Record<string, string> = { none: 'bg-secondary text-muted-foreground', invited: 'bg-warning/12 text-warning', account: 'bg-success/12 text-success' };

export const placementKindLabels: Record<string, string> = { placement_test: 'Prueba de ubicación', validation: 'Convalidación', revalidation: 'Revalidación', equivalence: 'Equivalencia' };
export const placementKindHints: Record<string, string> = {
  placement_test: 'Sin certificados: una evaluación define el ciclo y grado.',
  validation: 'Grados aprobados en EBR u otra institución, con certificado.',
  revalidation: 'Estudios del extranjero o de programas anteriores (EDA, PEBANA).',
  equivalence: 'Competencias laborales o certificaciones que acreditan aprendizajes.',
};
// What the student brings, for the cuadro de equivalencias
export const equivalenceOrigins: Record<string, string> = { ebr_primaria: 'Primaria (EBR)', ebr_secundaria: 'Secundaria (EBR)' };
// State of the acta's newest version
export const actStatusLabels: Record<string, string> = { pending: 'Pendiente de firma', published: 'Firmada', superseded: 'Reemplazada', cancelled: 'Anulada' };
export const actStatusClass: Record<string, string> = { pending: 'bg-warning/12 text-warning', published: 'bg-success/12 text-success', superseded: 'bg-secondary text-muted-foreground', cancelled: 'bg-secondary text-muted-foreground' };
export const actCode = (year: number, number: number): string => `N.° ${String(number).padStart(3, '0')}-${year}`;

// ---------- ficha única (EBA) ----------

export const motherTongueLabels: Record<string, string> = { castellano: 'Castellano', quechua: 'Quechua', aimara: 'Aimara', ashaninka: 'Asháninka', other: 'Otra' };
export const internetLabels: Record<string, string> = { mobile: 'Datos móviles', home: 'Internet en casa', public: 'Cabina o punto público', none: 'Sin internet', unknown: 'No indicó' };
export const deviceLabels: Record<string, string> = { phone: 'Celular', computer: 'Computadora', tablet: 'Tableta', none: 'Ninguno', unknown: 'No indicó' };
export const preferredModeLabels: Record<string, string> = { '': 'No indicó', in_person: 'Presencial', blended: 'Semipresencial', distance: 'A distancia' };
export const fileDocumentLabels: Record<string, string> = { dni: 'DNI', study_certificate: 'Certificado de estudios', birth_certificate: 'Partida de nacimiento', placement_act: 'Acta de ubicación o convalidación', other: 'Otro' };

// ---------- nómina and SIAGIE ----------

export const siagieLabels: Record<string, string> = { pending: 'Pendiente', exported: 'Exportado', observed: 'Observado' };
export const siagieClass: Record<string, string> = { pending: 'bg-secondary text-muted-foreground', exported: 'bg-success/12 text-success', observed: 'bg-warning/12 text-warning' };
// How the SIAGIE names the way a student enters the period
export const siagieSituationLabels: Record<string, string> = { new: 'Ingresante', continuing: 'Promovido', transfer_in: 'Trasladado', re_entry: 'Reentrante' };

// "Ccori Mamani, Valeria"
export const fullName = (s: { paternalSurname: string; maternalSurname: string; givenNames: string }): string => `${[s.paternalSurname, s.maternalSurname].filter(Boolean).join(' ')}, ${s.givenNames}`;

export const ageOn = (birthDate: string, today: string): number | null => {
  if (!birthDate || !today) return null;
  const [by, bm, bd] = birthDate.split('-').map(Number);
  const [ty, tm, td] = today.split('-').map(Number);
  return ty - by - (tm < bm || (tm === bm && td < bd) ? 1 : 0);
};

// Where a student stands in a period, as a short line: "3.° B · Secundaria"
export const placeLine = (e: { levelName: string; gradeShort?: string; gradeName?: string; sectionName?: string } | undefined, sectionNoun = 'Sección'): string => {
  if (!e) return 'Sin matrícula';
  const grade = e.gradeShort ?? '';
  const section = e.sectionName ? (grade ? ` ${e.sectionName}` : `${sectionNoun} ${e.sectionName}`) : '';
  return `${grade}${section}${grade || section ? ' · ' : ''}${e.levelName}`;
};
