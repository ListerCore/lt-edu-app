import type { Announcement } from '@/features/protected/announcements/types';
import type { IconInput } from 'morphicons/react';
import type { AppNotification } from '@/features/protected/notifications/types';

export type InstitutionType = 'EBR' | 'EBA' | 'EBE' | 'CEPRE' | 'IEST';

// Tipo de gestión (academic settings): public institutions charge no tuition, only enrollment and the APAFA fee
export type Management = 'public' | 'private';

export type Role = 'director' | 'coordinator' | 'secretary' | 'teacher' | 'tutor' | 'assistant' | 'psychologist' | 'treasurer' | 'technicalLead' | 'student' | 'guardian';

// One key per platform module (README §2); permissions and institution types are expressed with these
export type ModuleKey =
  | 'home'
  | 'notifications'
  | 'account'
  | 'institution'
  | 'structure'
  | 'periods'
  | 'courses'
  | 'schedules'
  | 'enrollment'
  | 'students'
  | 'staff'
  | 'student-attendance'
  | 'staff-attendance'
  | 'grades'
  | 'progress-reports'
  | 'mock-exams'
  | 'internships'
  | 'report-cards'
  | 'closing'
  | 'certificates'
  | 'attention-modes'
  | 'placement'
  // EBA: nómina de matrícula and the SIAGIE upload
  | 'roll'
  // EBA: permanence of the distance form, from the platform's activity
  | 'permanence'
  // EBA: the virtual tutor's desk (students, sessions, messages, SAANEE) and the student's own tutoring
  | 'virtual-tutoring'
  // EBA: DRE compliance (equipment of the virtual tutors, verification matrices and the two technical reports)
  | 'compliance'
  | 'individual-plans'
  | 'therapies'
  | 'inclusion-support'
  | 'rankings'
  | 'question-bank'
  | 'study-materials'
  | 'degrees'
  | 'parent-school'
  | 'cards'
  | 'tutoring'
  | 'discipline'
  | 'psychology'
  | 'wellbeing'
  | 'announcements'
  | 'payments'
  | 'reports'
  | 'users'
  | 'audit'
  // APAFA (parents' association) meetings and board: public institutions of Educación Básica only
  | 'apafa'
  // Virtual classroom (CEBA, phase E2): rooms and material, and the institution's library
  | 'classroom'
  | 'classroom-library'
  // Live sessions: live classes, virtual tutoring and psychology appointments, on the platform or on Google Meet
  | 'live-classes';

export type PermissionAction = 'view' | 'create' | 'update' | 'delete' | 'export';

export type RolePermissions = Partial<Record<ModuleKey, PermissionAction[]>>;

// A label can change with the institution type (e.g. "Bimestres" in EBR, "Ciclos" in CEPRE) and with the management
// type ("Pensiones y pagos" in private, "Pagos" in public); the management wording wins over the type's
export type NavLabel = string | (Partial<Record<InstitutionType | Management, string>> & { default: string });

// Second level: always a link to one module
export interface NavLeaf {
  label: NavLabel;
  href: string;
  module: ModuleKey;
  icon: IconInput;
}

// First level: a link (module + href) or a folding parent with leaves; never deeper than two levels
export interface NavItem {
  label: NavLabel;
  icon: IconInput;
  href?: string;
  module?: ModuleKey;
  children?: NavLeaf[];
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

// Simulated session context: who is signed in and in which institution (later it comes from lt-edu-api)
export interface Workspace {
  institutionType: InstitutionType;
  role: Role;
}

export interface WorkspaceProfile {
  institutionName: string;
  userName: string;
  // Profile photo; null shows the initials instead
  avatarUrl: string | null;
  roleLabel: string;
  institutionTypeLabel: string;
  // Roles that exist in the current institution type
  availableRoles: Role[];
}

// Management type of the workspace institution, read from lt-edu-api (a per-type demo default until it arrives)
// What lt-edu-api answers about the workspace institution (AcademicService.GetManagement)
export interface InstitutionManagement {
  management: Management;
  // Optional modules dirección turned off in Configuración › Institución
  disabledModules: ModuleKey[];
}

export interface UseInstitutionManagementResult {
  management: Management;
  disabledModules: ModuleKey[];
  isPublic: boolean;
  // False while the API answer is pending (management is the fallback meanwhile)
  isLoaded: boolean;
  // Asks the API again (after the profile is saved)
  reload: () => void;
}

export interface UseWorkspaceResult extends Workspace, WorkspaceProfile {
  management: Management;
  isPublic: boolean;
  reloadManagement: () => void;
  setInstitutionType: (type: InstitutionType) => void;
  setRole: (role: Role) => void;
  can: (module: ModuleKey, action?: PermissionAction) => boolean;
  // Whether the role sees a tab of a page (data/permissions.ts pageTabs)
  canTab: (page: 'schedules' | 'payments' | 'reports' | 'mocks', tab: string) => boolean;
}

// Navigation already filtered by permissions and with labels resolved for the institution type
export interface ResolvedLeaf {
  label: string;
  href: string;
  icon: IconInput;
}

export interface ResolvedItem {
  label: string;
  icon: IconInput;
  href?: string;
  children: ResolvedLeaf[];
}

export interface ResolvedSection {
  label: string;
  items: ResolvedItem[];
}

export interface SidebarNavItemProps {
  item: ResolvedItem;
  isActive: (href: string) => boolean;
}

export interface SidebarNavProps {
  pathname: string | null;
}

export interface UserAvatarProps {
  name: string;
  avatarUrl: string | null;
  className?: string;
}

export interface UseAnnouncementTickerResult {
  // undefined while the feed is empty or loading
  current: Announcement | undefined;
  index: number;
  total: number;
  pause: () => void;
  resume: () => void;
}

// Home (/dashboard): everything the landing renders, already prepared by useDashboardHome
export interface UseDashboardHomeResult {
  firstName: string;
  roleLabel: string;
  institutionName: string;
  institutionTypeLabel: string;
  // "miércoles, 18 de noviembre"; empty while prerendering
  todayLabel: string;
  // Modules of the role, taken from the sidebar tree
  shortcuts: ResolvedLeaf[];
  // The role reads announcements (otherwise the block is hidden)
  showAnnouncements: boolean;
  announcements: Announcement[];
  isLoadingAnnouncements: boolean;
  notifications: AppNotification[];
  isLoadingNotifications: boolean;
  unreadCount: number;
  // Reference time for the relative labels of the notifications
  now: number;
  isRead: (id: string) => boolean;
  markRead: (id: string) => void;
}

export interface DashboardHomeShortcutsProps {
  shortcuts: ResolvedLeaf[];
}

export interface DashboardHomeAnnouncementsProps {
  announcements: Announcement[];
  isLoading: boolean;
}

export interface DashboardHomeActivityProps {
  notifications: AppNotification[];
  isLoading: boolean;
  unreadCount: number;
  now: number;
  isRead: (id: string) => boolean;
  onOpen: (id: string) => void;
}
