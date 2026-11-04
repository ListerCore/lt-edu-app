import type { InstitutionType, ModuleKey, PermissionAction, Role, RolePermissions } from '../types';

const ALL: PermissionAction[] = ['view', 'create', 'update', 'delete', 'export'];
const VIEW: PermissionAction[] = ['view'];
const EDIT: PermissionAction[] = ['view', 'create', 'update'];

export const institutionTypeLabels: Record<InstitutionType, string> = {
  EBR: 'Colegio · EBR',
  EBA: 'CEBA · EBA',
  EBE: 'CEBE · EBE',
  CEPRE: 'Pre-universitario',
  IEST: 'Instituto',
};

export const roleLabels: Record<Role, string> = {
  director: 'Director',
  coordinator: 'Coordinador académico',
  secretary: 'Secretaría',
  teacher: 'Docente',
  tutor: 'Tutor',
  assistant: 'Auxiliar',
  psychologist: 'Psicólogo',
  treasurer: 'Tesorería',
  student: 'Estudiante',
  guardian: 'Apoderado',
};

// Modules every institution type shares; the rest depend on the type (README §2 matrix)
const commonModules: ModuleKey[] = ['home', 'institution', 'structure', 'periods', 'courses', 'schedules', 'enrollment', 'students', 'staff', 'student-attendance', 'staff-attendance', 'cards', 'tutoring', 'psychology', 'wellbeing', 'announcements', 'payments', 'reports', 'users', 'audit'];

export const institutionModules: Record<InstitutionType, ModuleKey[]> = {
  EBR: [...commonModules, 'grades'],
  EBA: [...commonModules, 'grades'],
  EBE: [...commonModules, 'progress-reports'],
  CEPRE: [...commonModules, 'mock-exams'],
  IEST: [...commonModules, 'grades', 'internships'],
};

// Every module except the confidential psychology area, which only its own role opens
const directorPermissions: RolePermissions = Object.fromEntries(commonModules.concat(['grades', 'progress-reports', 'mock-exams', 'internships']).filter((key) => key !== 'psychology').map((key) => [key, ALL]));

const teacherPermissions: RolePermissions = {
  home: VIEW,
  courses: VIEW,
  schedules: VIEW,
  students: VIEW,
  'student-attendance': EDIT,
  grades: EDIT,
  'progress-reports': EDIT,
  'mock-exams': EDIT,
  internships: EDIT,
  cards: VIEW,
  announcements: ['view', 'create'],
};

const studentPermissions: RolePermissions = {
  home: VIEW,
  courses: VIEW,
  schedules: VIEW,
  'student-attendance': VIEW,
  grades: VIEW,
  'progress-reports': VIEW,
  'mock-exams': VIEW,
  cards: VIEW,
  announcements: VIEW,
};

// What each role may do per module (README §3); a module missing from a role is invisible to it
export const rolePermissions: Record<Role, RolePermissions> = {
  director: directorPermissions,
  coordinator: {
    home: VIEW,
    structure: ALL,
    periods: ALL,
    courses: ALL,
    schedules: ALL,
    students: VIEW,
    staff: VIEW,
    'student-attendance': ['view', 'export'],
    'staff-attendance': VIEW,
    grades: ALL,
    'progress-reports': ALL,
    'mock-exams': ALL,
    internships: ALL,
    tutoring: VIEW,
    wellbeing: VIEW,
    announcements: ALL,
    reports: ['view', 'export'],
  },
  secretary: {
    home: VIEW,
    periods: VIEW,
    enrollment: ALL,
    students: ALL,
    staff: VIEW,
    'student-attendance': VIEW,
    cards: ALL,
    announcements: VIEW,
    reports: ['view', 'export'],
  },
  teacher: teacherPermissions,
  tutor: { ...teacherPermissions, tutoring: ALL, wellbeing: ['view', 'create'] },
  assistant: {
    home: VIEW,
    students: VIEW,
    'student-attendance': ALL,
    'staff-attendance': ['view', 'create'],
    announcements: VIEW,
  },
  psychologist: {
    home: VIEW,
    students: VIEW,
    tutoring: VIEW,
    psychology: ALL,
    wellbeing: ALL,
    announcements: VIEW,
  },
  treasurer: {
    home: VIEW,
    students: VIEW,
    payments: ALL,
    reports: ['view', 'export'],
    announcements: VIEW,
  },
  student: studentPermissions,
  guardian: { ...studentPermissions, payments: VIEW },
};

// A module is usable when the institution type has it AND the role is granted the action on it
export const canAccess = (institutionType: InstitutionType, role: Role, module: ModuleKey, action: PermissionAction = 'view'): boolean => institutionModules[institutionType].includes(module) && (rolePermissions[role][module]?.includes(action) ?? false);

// Simulated names for the demo workspace
export const demoInstitutionNames: Record<InstitutionType, string> = {
  EBR: 'I.E. San Martín de Porres',
  EBA: 'CEBA Joseph Lister',
  EBE: 'CEBE Santa Rosa',
  CEPRE: 'Academia Pre Ingenia',
  IEST: 'IESTP Andrés Avelino Cáceres',
};

export const demoUserNames: Record<Role, string> = {
  director: 'Rosa Huamán',
  coordinator: 'Luis Quispe',
  secretary: 'Carmen Flores',
  teacher: 'Jorge Mendoza',
  tutor: 'Ana Torres',
  assistant: 'Pedro Rojas',
  psychologist: 'Lucía Paredes',
  treasurer: 'Miguel Salazar',
  student: 'Valeria Ccori',
  guardian: 'Julio Ccori',
};
