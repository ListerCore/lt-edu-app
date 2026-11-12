import type { InstitutionType, Management, ModuleKey, PermissionAction, Role, RolePermissions } from '../types';

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
const coreModules: ModuleKey[] = ['home', 'notifications', 'account', 'announcements', 'institution', 'structure', 'periods', 'courses', 'schedules', 'enrollment', 'students', 'staff', 'student-attendance', 'staff-attendance', 'cards', 'tutoring', 'wellbeing', 'payments', 'reports', 'users', 'audit'];

// Each type adds the modules its academic flow needs (README §2 matrix)
export const institutionModules: Record<InstitutionType, ModuleKey[]> = {
  // School: competency grades, report cards, official certificates and the parents' school
  EBR: [...coreModules, 'grades', 'report-cards', 'closing', 'certificates', 'psychology', 'discipline', 'parent-school', 'apafa'],
  // CEBA: attention modes (in person, blended, distance), placement and validation tests, certificates
  EBA: [...coreModules, 'attention-modes', 'placement', 'grades', 'report-cards', 'closing', 'certificates', 'psychology', 'discipline', 'apafa'],
  // CEBE: levels per competency against the adaptations of each POI, individual plans, progress reports, therapies and
  // inclusion support (SAANEE)
  EBE: [...coreModules, 'grades', 'report-cards', 'closing', 'individual-plans', 'progress-reports', 'therapies', 'inclusion-support', 'psychology', 'discipline', 'parent-school', 'apafa'],
  // Pre-university academy: mock exams, rankings, question bank and study materials; no promotion or certificates
  CEPRE: [...coreModules, 'mock-exams', 'rankings', 'question-bank', 'study-materials'],
  // Institute: grades out of 20, internships (experiencias formativas), certificates and degrees
  IEST: [...coreModules, 'grades', 'report-cards', 'closing', 'study-materials', 'internships', 'certificates', 'degrees', 'psychology'],
};

// Modules that exist only under one management type. A module listed here is hidden from the other type even when
// the institution type has it; modules in neither list are shared.
//
// To add a public-only module (as done for 'apafa', the parents' association meetings):
//   1. add its key to ModuleKey (dashboard/types) and to the institution types that can be public in
//      institutionModules (EBR, EBA, EBE: academies and institutes in this platform are private);
//   2. list it here under public: { public: ['apafa'], private: [] };
//   3. grant it in rolePermissions (director gets it automatically) and add its entry to dashboard-navigation.ts;
//   4. wrap its page in <ModuleGuard module="apafa"> as every module page does.
// can('apafa') is then false in private institutions, and its nav entry disappears there
export const managementModules: Record<Management, ModuleKey[]> = {
  // APAFA (Ley N.° 28628): the parents' association of public schools, CEBA and CEBE
  public: ['apafa'],
  private: [],
};

const exclusiveModules = new Set<ModuleKey>(Object.values(managementModules).flat());

// True when the module exists under that management type (shared modules always do)
export const hasManagementModule = (management: Management, module: ModuleKey): boolean => !exclusiveModules.has(module) || managementModules[management].includes(module);

// What the panel assumes before joseph-api answers: the Joseph demos of CEBA and CEBE are public, the rest private
export const demoManagement: Record<InstitutionType, Management> = {
  EBR: 'private',
  EBA: 'public',
  EBE: 'public',
  CEPRE: 'private',
  IEST: 'private',
};

const allModules: ModuleKey[] = [...new Set(Object.values(institutionModules).flat())];

// Every module except the confidential psychology area, which only its own role opens
const directorPermissions: RolePermissions = Object.fromEntries(allModules.filter((key) => key !== 'psychology').map((key) => [key, ALL]));

const teacherPermissions: RolePermissions = {
  home: VIEW,
  notifications: ['view', 'update'],
  account: ['view', 'update'],
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
  // Teachers report faults and refer students to psychology (they see the status of their referrals)
  discipline: ['view', 'create'],
  psychology: ['view', 'create'],
  therapies: VIEW,
};

const studentPermissions: RolePermissions = {
  home: VIEW,
  notifications: ['view', 'update'],
  account: ['view', 'update'],
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
  // Families read the tutor's agreements, their commitments and their children's faults and measures
  tutoring: VIEW,
  discipline: VIEW,
};

// What each role may do per module (README §3); a module missing from a role is invisible to it
export const rolePermissions: Record<Role, RolePermissions> = {
  director: directorPermissions,
  coordinator: {
    home: VIEW,
    notifications: ['view', 'update'],
    account: ['view', 'update'],
    structure: ALL,
    'attention-modes': ALL,
    placement: ALL,
    'report-cards': ALL,
    closing: ALL,
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
    discipline: VIEW,
    announcements: ALL,
    reports: ['view', 'export'],
    // Reads the APAFA meetings and their actas; dirección and secretaría convene them
    apafa: VIEW,
  },
  secretary: {
    home: VIEW,
    notifications: ['view', 'update'],
    account: ['view', 'update'],
    periods: VIEW,
    enrollment: ALL,
    placement: VIEW,
    certificates: ALL,
    degrees: ALL,
    students: ALL,
    staff: VIEW,
    'student-attendance': VIEW,
    'report-cards': VIEW,
    closing: VIEW,
    'mock-exams': ['view', 'create'],
    rankings: VIEW,
    cards: ALL,
    announcements: VIEW,
    reports: ['view', 'export'],
    // Convenes the APAFA meetings, records the acta and keeps the board (with dirección)
    apafa: ALL,
  },
  teacher: teacherPermissions,
  tutor: { ...teacherPermissions, tutoring: ALL, wellbeing: ['view', 'create'], discipline: EDIT, 'parent-school': EDIT },
  assistant: {
    home: VIEW,
    notifications: ['view', 'update'],
    account: ['view', 'update'],
    students: VIEW,
    'student-attendance': ALL,
    'staff-attendance': ['view', 'create'],
    discipline: ['view', 'create'],
    wellbeing: VIEW,
    announcements: VIEW,
  },
  psychologist: {
    home: VIEW,
    notifications: ['view', 'update'],
    account: ['view', 'update'],
    students: VIEW,
    tutoring: VIEW,
    psychology: ALL,
    wellbeing: ALL,
    discipline: VIEW,
    therapies: EDIT,
    'individual-plans': VIEW,
    'inclusion-support': EDIT,
    'parent-school': ALL,
    announcements: VIEW,
  },
  treasurer: {
    home: VIEW,
    notifications: ['view', 'update'],
    account: ['view', 'update'],
    students: VIEW,
    payments: ALL,
    reports: ['view', 'export'],
    announcements: VIEW,
  },
  student: studentPermissions,
  // Families read the APAFA meetings of their institution once convened, with the agenda, the acta and the documents
  guardian: { ...studentPermissions, payments: VIEW, 'progress-reports': VIEW, 'individual-plans': VIEW, therapies: VIEW, 'parent-school': VIEW, apafa: VIEW },
};

// A module is usable when the role exists in the institution type, the type has the module, the management type has
// it too (managementModules) and the role is granted the action
export const canAccess = (institutionType: InstitutionType, role: Role, module: ModuleKey, action: PermissionAction = 'view', management: Management = 'private'): boolean =>
  institutionRoles[institutionType].includes(role) && institutionModules[institutionType].includes(module) && hasManagementModule(management, module) && (rolePermissions[role][module]?.includes(action) ?? false);

// ---------- tabs ----------

const MANAGERS: Role[] = ['director', 'coordinator'];
const STAFF: Role[] = ['director', 'coordinator', 'secretary', 'teacher', 'tutor', 'assistant', 'psychologist', 'treasurer'];
const EVERYONE: Role[] = [...STAFF, 'student', 'guardian'];

// Which roles see each tab of the pages whose views differ by role. A role reaching a page sees only these tabs;
// the API still checks every call, this only keeps out of sight what the role cannot use
export const pageTabs = {
  schedules: { mine: EVERYONE, section: STAFF, teacher: STAFF, load: MANAGERS, blocks: MANAGERS, export: [...MANAGERS, 'secretary'] },
  payments: { summary: ['director', 'secretary', 'treasurer'], accounts: ['director', 'secretary', 'treasurer'], cash: ['director', 'secretary', 'treasurer'], plans: ['director', 'treasurer'] },
  reports: { attendance: [...MANAGERS, 'secretary'], performance: MANAGERS, enrollment: [...MANAGERS, 'secretary'], finance: ['director', 'treasurer'], compare: ['director', 'coordinator', 'secretary', 'treasurer'] },
  mocks: { structure: [...MANAGERS, 'secretary', 'teacher'], key: [...MANAGERS, 'teacher'], sheets: [...MANAGERS, 'secretary', 'teacher'], results: [...MANAGERS, 'secretary', 'teacher', 'tutor'] },
} satisfies Record<string, Record<string, Role[]>>;

export type TabPage = keyof typeof pageTabs;

// True when the role sees that tab of the page; tabs missing from the map are open to every role
export const canSeeTab = <P extends TabPage>(role: Role, page: P, tab: string): boolean => (pageTabs[page] as Record<string, Role[]>)[tab]?.includes(role) ?? true;

// Simulated names for the demo workspace
export const demoInstitutionNames: Record<InstitutionType, string> = {
  EBR: 'Joseph Colegio',
  EBA: 'Joseph Escuela',
  EBE: 'Joseph Especial',
  CEPRE: 'Joseph Academia',
  IEST: 'Joseph Instituto',
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
