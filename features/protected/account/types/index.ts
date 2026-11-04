import type { IconInput } from 'morphicons/react';
import type { InstitutionType, Role } from '@/features/protected/dashboard/types';

export interface AccountField {
  label: string;
  value: string;
  // Monospace for codes, document numbers and phones
  mono?: boolean;
}

export interface AccountSection {
  id: string;
  title: string;
  icon: IconInput;
  fields: AccountField[];
}

// A person linked to the account: the guardian's children
export interface LinkedPerson {
  name: string;
  detail: string;
  code: string;
}

export interface AccountActivity {
  id: string;
  title: string;
  detail: string;
  // ISO date-time; formatted on the client
  at: string;
}

// Fields the person can edit themselves
export interface AccountContact {
  email: string;
  phone: string;
  address: string;
}

export interface AccountProfile {
  // Key of the photo in the shared photo store (the same photo prints on the card)
  photoKey: string;
  fullName: string;
  roleLabel: string;
  institutionName: string;
  institutionType: InstitutionType;
  role: Role;
  code: string;
  headline: string;
  contact: AccountContact;
  sections: AccountSection[];
  linked: LinkedPerson[];
  activity: AccountActivity[];
  security: { twoFactor: boolean; passwordUpdatedAt: string; lastAccessAt: string; lastAccessFrom: string };
}

export interface AccountActionResult<T> {
  ok: boolean;
  message: string;
  data?: T;
}

export interface UseGetAccountProfileResult {
  profile: AccountProfile | null;
  isLoading: boolean;
  // Applies a saved contact without refetching
  applyContact: (contact: AccountContact) => void;
}

export interface UseUpdateAccountContactResult {
  values: AccountContact;
  errors: Partial<Record<keyof AccountContact, string>>;
  isEditing: boolean;
  isPending: boolean;
  setField: (field: keyof AccountContact, value: string) => void;
  startEditing: () => void;
  cancel: () => void;
  submit: () => void;
}

export interface UsePrintProfileReportResult {
  generatedAt: string | null;
  print: () => void;
}

export interface AccountProfileProps {
  profile: AccountProfile;
}

export interface AccountHeaderProps extends AccountProfile {
  photoUrl: string | null;
  isPhotoPending: boolean;
  photoError: string | null;
  onPhotoSelect: (file: File) => void;
  onDownloadReport: () => void;
}

export interface AccountContactCardProps {
  contact: AccountContact;
  onSaved: (contact: AccountContact) => void;
}

export interface AccountSectionCardProps {
  section: AccountSection;
}

export interface AccountReportProps {
  profile: AccountProfile;
  photoUrl: string | null;
  generatedAt: string;
}
