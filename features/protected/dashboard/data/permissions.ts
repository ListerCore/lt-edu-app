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
  technicalLead: 'Responsable técnico',
  student: 'Estudiante',
  guardian: 'Apoderado',
};

// Some roles carry another name in certain institutions
const roleLabelOverrides: Partial<Record<InstitutionType, Partial<Record<Role, string>>>> = {
  EBA: { tutor: 'Tutor virtual', student: 'Estudiante EBA' },
  CEPRE: { coordinator: 'Coordinador de ciclo', student: 'Alumno' },
  IEST: { director: 'Director general', coordinator: 'Jefe de unidad académica', psychologist: 'Bienestar estudiantil' },
};

export const roleLabel = (role: Role, institutionType: InstitutionType): string => roleLabelOverrides[institutionType]?.[role] ?? roleLabels[role];

// Roles that exist in each institution type, in the order the selector lists them (README §3)
export const institutionRoles: Record<InstitutionType, Role[]> = {
  EBR: ['director', 'coordinator', 'secretary', 'teacher', 'tutor', 'assistant', 'psychologist', 'treasurer', 'student', 'guardian'],
  EBA: ['director', 'coordinator', 'secretary', 'teacher', 'tutor', 'psychologist', 'treasurer', 'technicalLead', 'student'],
  EBE: ['director', 'coordinator', 'secretary', 'teacher', 'assistant', 'psychologist', 'treasurer', 'guardian'],
  CEPRE: ['director', 'coordinator', 'secretary', 'teacher', 'tutor', 'treasurer', 'student', 'guardian'],
  IEST: ['director', 'coordinator', 'secretary', 'teacher', 'tutor', 'psychologist', 'treasurer', 'student'],
};

// Modules every institution type shares
const coreModules: ModuleKey[] = ['home', 'notifications', 'account', 'announcements', 'institution', 'structure', 'periods', 'courses', 'schedules', 'enrollment', 'students', 'staff', 'student-attendance', 'staff-attendance', 'cards', 'tutoring', 'wellbeing', 'payments', 'reports', 'users', 'audit'];

// Each type adds the modules its academic flow needs (README §2 matrix)
export const institutionModules: Record<InstitutionType, ModuleKey[]> = {
  // School: competency grades, report cards and the parents' school (the certificates page is the institutes')
  EBR: [...coreModules, 'grades', 'report-cards', 'closing', 'psychology', 'live-classes', 'discipline', 'parent-school', 'apafa'],
  // CEBA: attention modes (in person, blended, distance), placement and validation tests; its constancias are on
  // each student (the certificates page is the institutes')
  EBA: [...coreModules, 'attention-modes', 'placement', 'roll', 'permanence', 'virtual-tutoring', 'compliance', 'classroom', 'classroom-library', 'live-classes', 'grades', 'report-cards', 'closing', 'psychology', 'discipline', 'apafa'],
  // CEBE: levels per competency against the adaptations of each POI, individual plans, progress reports, therapies and
  // inclusion support (SAANEE)
  EBE: [...coreModules, 'grades', 'report-cards', 'closing', 'individual-plans', 'progress-reports', 'therapies', 'inclusion-support', 'psychology', 'discipline', 'parent-school', 'apafa'],
  // Pre-university academy: mock exams, rankings, question bank and study materials; no promotion or certificates
  CEPRE: [...coreModules, 'mock-exams', 'rankings', 'question-bank', 'study-materials'],
  // Institute: grades out of 20, internships (experiencias formativas), certificates and degrees
  IEST: [...coreModules, 'grades', 'report-cards', 'closing', 'study-materials', 'internships', 'certificates', 'degrees', 'psychology', 'live-classes'],
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

// What the panel assumes before lt-edu-api answers: the ListerCore Edu demos of CEBA and CEBE are public, the rest private
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
  permanence: VIEW,
  // A teacher may be the tutor of some students (assigned one by one)
  'virtual-tutoring': ['view', 'create'],
  grades: EDIT,
  'report-cards': VIEW,
  'progress-reports': EDIT,
  'individual-plans': EDIT,
  'mock-exams': EDIT,
  rankings: VIEW,
  'question-bank': EDIT,
  'study-materials': EDIT,
  internships: EDIT,
  // Teachers build the virtual classroom of the subjects they teach (the API checks which rooms)
  classroom: EDIT,
  'classroom-library': EDIT,
  // Their live classes and tutoring sessions (the API says which ones they host)
  'live-classes': VIEW,
  cards: VIEW,
  announcements: ['view', 'create'],
  // Teachers report faults and refer students to psychology (they see the status of their referrals)
  discipline: ['view', 'create'],
  psychology: ['view', 'create'],
  therapies: VIEW,
};

const studentPermissions: RolePermissions = {
  home: VIEW,
  // EBA: their tutor, sessions and the conversation with the tutor
  'virtual-tutoring': VIEW,
  notifications: ['view', 'update'],
  account: ['view', 'update'],
  // Courses and the grade sheets are staff's (the API refuses families): students read their report card
  schedules: VIEW,
  'student-attendance': VIEW,
  'report-cards': VIEW,
  'mock-exams': VIEW,
  rankings: VIEW,
  'study-materials': VIEW,
  internships: VIEW,
  classroom: VIEW,
  // Their live classes, tutoring and psychology appointments, to join them
  'live-classes': VIEW,
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
    roll: ALL,
    permanence: ALL,
    'virtual-tutoring': ALL,
    compliance: VIEW,
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
    // Reads the institution file (authorizations, platform sheet); dirección records it
    institution: VIEW,
    classroom: ALL,
    'classroom-library': ALL,
    'live-classes': VIEW,
  },
  secretary: {
    home: VIEW,
    notifications: ['view', 'update'],
    account: ['view', 'update'],
    periods: VIEW,
    enrollment: ALL,
    // Secretaría runs the procedures and the SIAGIE upload; the acta is signed by its signers
    placement: ALL,
    roll: ALL,
    permanence: VIEW,
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
    institution: VIEW,
    classroom: VIEW,
  },
  teacher: teacherPermissions,
  // The tutor adjusts the permanence of their own distance section (the API checks it)
  tutor: { ...teacherPermissions, permanence: EDIT, 'virtual-tutoring': ALL, tutoring: ALL, wellbeing: ['view', 'create'], discipline: EDIT, 'parent-school': EDIT },
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
    // Psychology appointments by video call
    'live-classes': VIEW,
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
  // Responsable técnico (CEBA): keeps the e-learning platform sheet for the DRE reports and reads the structure it
  // documents; the equipment and evidence modules join in phase E8 (docs/ceba/PLAN.md)
  technicalLead: {
    home: VIEW,
    notifications: ['view', 'update'],
    account: ['view', 'update'],
    institution: ['view', 'update'],
    structure: VIEW,
    'attention-modes': VIEW,
    periods: VIEW,
    announcements: VIEW,
    // Keeps the equipment, the evidence and the two technical reports; the only one who verifies a row
    compliance: ALL,
    // Reads the virtual classroom: evidence of the Anexo 2 for the DRE reports
    classroom: VIEW,
    'classroom-library': VIEW,
  },
  student: studentPermissions,
  // Families read the APAFA meetings of their institution once convened, with the agenda, the acta and the documents
  guardian: { ...studentPermissions, payments: VIEW, 'progress-reports': VIEW, 'individual-plans': VIEW, therapies: VIEW, 'parent-school': VIEW, apafa: VIEW },
};

// A module is usable when the role exists in the institution type, the type has the module, the management type has
// it too (managementModules) and the role is granted the action
// An optional module the institution turned off also takes the pages that live on its API service with it
const moduleFamilies: Partial<Record<ModuleKey, ModuleKey[]>> = {
  'mock-exams': ['mock-exams', 'rankings', 'question-bank'],
  classroom: ['classroom', 'classroom-library'],
};

// isModuleDisabled: whether module is off for the institution (directly or through its family)
export const isModuleDisabled = (module: ModuleKey, disabledModules: readonly ModuleKey[]): boolean =>
  disabledModules.some((off) => off === module || (moduleFamilies[off]?.includes(module) ?? false));

export const canAccess = (institutionType: InstitutionType, role: Role, module: ModuleKey, action: PermissionAction = 'view', management: Management = 'private', disabledModules: readonly ModuleKey[] = []): boolean =>
  institutionRoles[institutionType].includes(role) &&
  institutionModules[institutionType].includes(module) &&
  hasManagementModule(management, module) &&
  !isModuleDisabled(module, disabledModules) &&
  (rolePermissions[role][module]?.includes(action) ?? false);

// ---------- tabs ----------

const MANAGERS: Role[] = ['director', 'coordinator'];
const STAFF: Role[] = ['director', 'coordinator', 'secretary', 'teacher', 'tutor', 'assistant', 'psychologist', 'treasurer', 'technicalLead'];
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
  EBR: 'ListerCore Colegio',
  EBA: 'ListerCore CEBA',
  EBE: 'ListerCore CEBE',
  CEPRE: 'ListerCore Academia',
  IEST: 'ListerCore Instituto',
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
  technicalLead: 'Daniel Vargas',
  student: 'Valeria Ccori',
  guardian: 'Julio Ccori',
};

// Demo profile photos; roles without one fall back to their initials
export const demoAvatarUrls: Partial<Record<Role, string>> = {};
