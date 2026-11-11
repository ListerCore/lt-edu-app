import { DASHBOARD_PATH } from '@/features/protected/dashboard/data/dashboard-navigation';

export const STUDENTS_PATH = `${DASHBOARD_PATH}/students`;
export const NEW_STUDENT_PATH = `${STUDENTS_PATH}/new`;
export const studentPath = (id: string): string => `${STUDENTS_PATH}/${id}`;
export const ENROLLMENT_PATH = `${DASHBOARD_PATH}/enrollment`;
export const PLACEMENT_PATH = `${ENROLLMENT_PATH}/placement`;

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

export const placementKindLabels: Record<string, string> = { placement_test: 'Prueba de ubicación', validation: 'Convalidación' };

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
