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

// Some roles carry another name in certain institutions
const roleLabelOverrides: Partial<Record<InstitutionType, Partial<Record<Role, string>>>> = {
  EBA: { student: 'Estudiante EBA' },
  CEPRE: { coordinator: 'Coordinador de ciclo', student: 'Alumno' },
  IEST: { director: 'Director general', coordinator: 'Jefe de unidad académica', psychologist: 'Bienestar estudiantil' },
};

export const roleLabel = (role: Role, institutionType: InstitutionType): string => roleLabelOverrides[institutionType]?.[role] ?? roleLabels[role];

// Roles that exist in each institution type, in the order the selector lists them (README §3)
export const institutionRoles: Record<InstitutionType, Role[]> = {
  EBR: ['director', 'coordinator', 'secretary', 'teacher', 'tutor', 'assistant', 'psychologist', 'treasurer', 'student', 'guardian'],
  EBA: ['director', 'coordinator', 'secretary', 'teacher', 'tutor', 'psychologist', 'treasurer', 'student'],
  EBE: ['director', 'coordinator', 'secretary', 'teacher', 'assistant', 'psychologist', 'treasurer', 'guardian'],
  CEPRE: ['director', 'coordinator', 'secretary', 'teacher', 'tutor', 'treasurer', 'student', 'guardian'],
  IEST: ['director', 'coordinator', 'secretary', 'teacher', 'tutor', 'psychologist', 'treasurer', 'student'],
};

// Modules every institution type shares
const coreModules: ModuleKey[] = ['home', 'announcements', 'institution', 'structure', 'periods', 'courses', 'schedules', 'enrollment', 'students', 'staff', 'student-attendance', 'staff-attendance', 'cards', 'tutoring', 'wellbeing', 'payments', 'reports', 'users', 'audit'];

// Each type adds the modules its academic flow needs (README §2 matrix)
export const institutionModules: Record<InstitutionType, ModuleKey[]> = {
  // School: competency grades, report cards, official certificates and the parents' school
  EBR: [...coreModules, 'grades', 'report-cards', 'certificates', 'psychology', 'parent-school'],
  // CEBA: attention modes (in person, blended, distance), placement and validation tests, certificates
  EBA: [...coreModules, 'attention-modes', 'placement', 'grades', 'report-cards', 'certificates', 'psychology'],
  // CEBE: no grades; individual plans, qualitative progress reports, therapies and inclusion support (SAANEE)
  EBE: [...coreModules, 'individual-plans', 'progress-reports', 'therapies', 'inclusion-support', 'psychology', 'parent-school'],
  // Pre-university academy: mock exams, rankings, question bank and study materials; no promotion or certificates
  CEPRE: [...coreModules, 'mock-exams', 'rankings', 'question-bank', 'study-materials'],
  // Institute: grades out of 20, internships (experiencias formativas), certificates and degrees
  IEST: [...coreModules, 'grades', 'report-cards', 'study-materials', 'internships', 'certificates', 'degrees', 'psychology'],
};

const allModules: ModuleKey[] = [...new Set(Object.values(institutionModules).flat())];

// Every module except the confidential psychology area, which only its own role opens
const directorPermissions: RolePermissions = Object.fromEntries(allModules.filter((key) => key !== 'psychology').map((key) => [key, ALL]));

const teacherPermissions: RolePermissions = {
  home: VIEW,
  courses: VIEW,
  schedules: VIEW,
  students: VIEW,
  'student-attendance': EDIT,
  grades: EDIT,
  'report-cards': VIEW,
  'progress-reports': EDIT,
  'individual-plans': EDIT,
  'mock-exams': EDIT,
  rankings: VIEW,
  'question-bank': EDIT,
  'study-materials': EDIT,
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
  'report-cards': VIEW,
  'mock-exams': VIEW,
  rankings: VIEW,
  'study-materials': VIEW,
  internships: VIEW,
  certificates: VIEW,
  cards: VIEW,
  announcements: VIEW,
};

// What each role may do per module (README §3); a module missing from a role is invisible to it
export const rolePermissions: Record<Role, RolePermissions> = {
  director: directorPermissions,
  coordinator: {
    home: VIEW,
    structure: ALL,
    'attention-modes': ALL,
    placement: ALL,
    'report-cards': ALL,
    'individual-plans': ALL,
    'inclusion-support': ALL,
    therapies: VIEW,
    rankings: ALL,
    'question-bank': ALL,
    'study-materials': ALL,
    degrees: VIEW,
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
    placement: VIEW,
    certificates: ALL,
    degrees: ALL,
    students: ALL,
    staff: VIEW,
    'student-attendance': VIEW,
    cards: ALL,
    announcements: VIEW,
    reports: ['view', 'export'],
  },
  teacher: teacherPermissions,
  tutor: { ...teacherPermissions, tutoring: ALL, wellbeing: ['view', 'create'], 'parent-school': EDIT },
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
    therapies: EDIT,
    'individual-plans': VIEW,
    'inclusion-support': EDIT,
    'parent-school': ALL,
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
  guardian: { ...studentPermissions, payments: VIEW, 'progress-reports': VIEW, 'individual-plans': VIEW, therapies: VIEW, 'parent-school': VIEW },
};

// A module is usable when the role exists in the institution type, the type has the module and the role is granted the action
export const canAccess = (institutionType: InstitutionType, role: Role, module: ModuleKey, action: PermissionAction = 'view'): boolean => institutionRoles[institutionType].includes(role) && institutionModules[institutionType].includes(module) && (rolePermissions[role][module]?.includes(action) ?? false);

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

// Demo profile photos; roles without one fall back to their initials
export const demoAvatarUrls: Partial<Record<Role, string>> = {};
