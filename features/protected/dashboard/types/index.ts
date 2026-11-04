import type { Announcement } from '@/features/protected/announcements/types';
import type { IconInput } from 'morphicons/react';

export type InstitutionType = 'EBR' | 'EBA' | 'EBE' | 'CEPRE' | 'IEST';

export type Role = 'director' | 'coordinator' | 'secretary' | 'teacher' | 'tutor' | 'assistant' | 'psychologist' | 'treasurer' | 'student' | 'guardian';

// One key per platform module (README §2); permissions and institution types are expressed with these
export type ModuleKey =
  | 'home'
  | 'notifications'
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
  | 'certificates'
  | 'attention-modes'
  | 'placement'
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
  | 'psychology'
  | 'wellbeing'
  | 'announcements'
  | 'payments'
  | 'reports'
  | 'users'
  | 'audit';

export type PermissionAction = 'view' | 'create' | 'update' | 'delete' | 'export';

export type RolePermissions = Partial<Record<ModuleKey, PermissionAction[]>>;

// A label can change with the institution type (e.g. "Bimestres" in EBR, "Ciclos" in CEPRE)
export type NavLabel = string | Partial<Record<InstitutionType, string>> & { default: string };

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

// Simulated session context: who is signed in and in which institution (later it comes from joseph-api)
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

export interface UseWorkspaceResult extends Workspace, WorkspaceProfile {
  setInstitutionType: (type: InstitutionType) => void;
  setRole: (role: Role) => void;
  can: (module: ModuleKey, action?: PermissionAction) => boolean;
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
  current: Announcement;
  index: number;
  total: number;
  pause: () => void;
  resume: () => void;
}
