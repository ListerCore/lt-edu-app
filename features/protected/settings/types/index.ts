import type { AuditEvent, Authorization, Member, PlatformSheet } from '@/lib/api/grpc/gen/ltedu/institution/v1/institution';
import type { AcademicResult, FormState, Level, RemoteState } from '@/features/protected/academic/types';

export type { AcademicResult, AuditEvent, Authorization, FormState, Member, PlatformSheet, RemoteState };

// ---------- institution file ----------

export interface InstitutionFileData {
  // Owner id of the platform sheet's attachments (one sheet per institution)
  institutionId: string;
  institutionName: string;
  // ebr | eba | ebe | cepre | institute
  institutionKind: string;
  authorizations: Authorization[];
  platform: PlatformSheet;
  canManageAuthorizations: boolean;
  canEditPlatform: boolean;
}

// What the Institución page shows: the file plus the cycles an authorization can name (CEBA only)
export interface InstitutionPageState extends RemoteState<InstitutionFileData> {
  levels: Level[];
  isEba: boolean;
  // Authorizations in force first, then the rest
  inForce: Authorization[];
  expired: Authorization[];
}

export interface AuthorizationValues {
  kind: string;
  levelId: string;
  attentionMode: string;
  resolution: string;
  issuedBy: string;
  issuedOn: string;
  expiresOn: string;
  fileNumber: string;
  notes: string;
}

export interface AuthorizationPayload extends AuthorizationValues {
  id: string;
}

export interface UseAuthorizationFormParams {
  authorization: Authorization | null;
  onSaved: () => void;
}

export interface UseDeleteAuthorizationResult {
  remove: (id: string) => void;
  deletingId: string | null;
}

export interface PlatformSheetValues {
  platformName: string;
  url: string;
  technology: string;
  administrator: string;
  accessProfiles: string;
  hostingKind: string;
  hostingOther: string;
  provider: string;
  instance: string;
  contractReference: string;
  serviceStatus: string;
  validUntil: string;
  technicalLead: string;
  technicalLeadSpecialty: string;
  technicalLeadCip: string;
}

export interface UsePlatformSheetFormParams {
  platform: PlatformSheet;
  onSaved: () => void;
}

export interface AuthorizationDialogProps {
  authorization: Authorization | null;
  levels: Level[];
  isEba: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export interface AuthorizationListProps {
  title: string;
  authorizations: Authorization[];
  canManage: boolean;
  empty: string;
  deletingId: string | null;
  onEdit: (a: Authorization) => void;
  onDelete: (id: string) => void;
}

export interface PlatformSheetCardProps {
  institutionId: string;
  platform: PlatformSheet;
  canEdit: boolean;
  onSaved: () => void;
}

// ---------- members ----------

export interface MembersData {
  members: Member[];
  grantableRoles: string[];
  selfUserId: string;
}

// One person with every staff role they hold or are invited to
export interface MemberGroup {
  email: string;
  fullName: string;
  userId: string;
  lastSignInAt: string;
  // Only invitations: the person has not created the account yet
  pending: boolean;
  isSelf: boolean;
  accesses: Member[];
}

export interface UsersPageState extends RemoteState<MembersData> {
  groups: MemberGroup[];
  query: string;
  setQuery: (q: string) => void;
  roleFilter: string;
  setRoleFilter: (role: string) => void;
  grantableRoles: string[];
}

export interface GrantMemberValues {
  email: string;
  role: string;
}

export interface UseGrantMemberParams {
  defaultRole: string;
  onGranted: () => void;
}

export interface UseRevokeMemberResult {
  revoke: (id: string) => void;
  revokingId: string | null;
}

export interface GrantMemberDialogProps {
  grantableRoles: string[];
  onClose: () => void;
  onGranted: () => void;
}

export interface MemberRowProps {
  group: MemberGroup;
  grantableRoles: string[];
  revokingId: string | null;
  onRevoke: (id: string) => void;
}

// ---------- audit ----------

export interface AuditFilters {
  module: string;
  from: string;
  to: string;
}

export interface AuditPageResult {
  events: AuditEvent[];
  hasMore: boolean;
  nextBeforeAt: string;
  nextBeforeId: string;
}

export interface AuditQuery extends AuditFilters {
  beforeAt: string;
  beforeId: string;
}

// One event as the list shows it: when, who and the changed fields already readable
export interface AuditRow {
  id: string;
  when: string;
  day: string;
  who: string;
  roleLabel: string;
  moduleLabel: string;
  actionLabel: string;
  actionClass: string;
  summary: string;
  changes: Array<{ field: string; before: string; after: string }>;
}

export interface AuditPageState {
  rows: AuditRow[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  filters: AuditFilters;
  setFilter: <K extends keyof AuditFilters>(key: K, value: AuditFilters[K]) => void;
  clearFilters: () => void;
  loadMore: () => void;
  reload: () => void;
}
