export type InstitutionKind = 'ebr' | 'eba' | 'ebe' | 'cepre' | 'institute';

export interface AccountInstitution {
  id: string;
  slug: string;
  name: string;
  kind: InstitutionKind;
}

// One role the person holds; institution roles say where (platform roles have none)
export interface AccountRole {
  id: string;
  code: string;
  name: string;
  scope: 'platform' | 'institution';
  institution: AccountInstitution | null;
}

// The signed-in account, from joseph-api's GET /auth/me
export interface Account {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  emailVerified: boolean;
  hasPassword: boolean;
  createdAt: string;
  roles: AccountRole[];
  activeRoleId: string | null;
  googleLinked: boolean;
  passwordChangedAt: string | null;
  lastSignInAt: string | null;
}

export interface UsedRecoveryCode {
  code: string;
  usedAt: string;
}

// GET /auth/mfa: the authenticator app and the recovery codes (how many are left, the ones already spent)
export interface TwoFactorStatus {
  enabled: boolean;
  enabledAt: string | null;
  recovery: { total: number; remaining: number; used: UsedRecoveryCode[] };
}

// What a mailed code confirms
export type MfaPurpose = 'mfa_enable' | 'mfa_disable' | 'mfa_recovery_codes';

export interface MailedCode {
  challengeToken: string;
  email: string;
}

export interface TotpSetup {
  secret: string;
  otpauthUri: string;
  // data: URL of the QR the app scans
  qrPng: string;
}

export interface AccountActionResult<T = undefined> {
  ok: boolean;
  message: string;
  code?: string;
  data?: T;
}

export interface UseAccountResult {
  account: Account | null;
  twoFactor: TwoFactorStatus | null;
  error: string | null;
  isLoading: boolean;
  reload: () => void;
}

// idle → email (code mailed) → scan (QR, enabling only) → codes (recovery codes to keep)
export type TwoFactorStep = 'idle' | 'email' | 'scan' | 'codes';

export interface UseTwoFactorSettingsResult {
  step: TwoFactorStep;
  purpose: MfaPurpose | null;
  email: string;
  digits: string[];
  appDigits: string[];
  setup: TotpSetup | null;
  codes: string[];
  issuedAt: Date | null;
  error?: string;
  isPending: boolean;
  resendIn: number;
  start: (purpose: MfaPurpose) => void;
  resend: () => void;
  setDigits: (digits: string[]) => void;
  setAppDigits: (digits: string[]) => void;
  submitEmailCode: () => void;
  submitAppCode: () => void;
  finish: () => void;
  cancel: () => void;
}

export interface UseSwitchRoleResult {
  pendingId: string | null;
  switchTo: (userRoleId: string) => void;
}

export interface AccountHeaderProps {
  account: Account;
  activeRole: AccountRole | null;
  photoUrl: string | null;
  isPhotoPending: boolean;
  photoError: string | null;
  onPhotoSelect: (file: File) => void;
}

export interface AccountRolesCardProps {
  account: Account;
  onSwitched: () => void;
}

export interface AccountSecurityCardProps {
  account: Account;
}

export interface TwoFactorCardProps {
  status: TwoFactorStatus;
  email: string;
  onChanged: () => void;
}

export interface RecoveryCodesSheetProps {
  codes: string[];
  email: string;
  issuedAt: Date;
}

export interface UsedRecoveryCodesProps {
  status: TwoFactorStatus;
}
