import type { IconInput } from 'morphicons/react';
import type { ModuleKey } from '@/features/protected/dashboard/types';

// Record a file hangs on (attachments.files.owner_kind in joseph-api)
export type AttachmentOwnerKind = 'enrollment' | 'student' | 'staff' | 'tutoring' | 'discipline' | 'psychology' | 'individual_plan' | 'therapy' | 'progress_report' | 'inclusion_support' | 'period' | 'closing' | 'internship' | 'degree' | 'attendance_justification' | 'apafa_meeting' | 'authorization' | 'platform_sheet';

// What a file is (DNI, acta, resolución...); joseph-api keeps the list allowed per owner kind
export type AttachmentCategory =
  | 'dni'
  | 'birth_certificate'
  | 'study_certificate'
  | 'transfer_certificate'
  | 'enrollment_form'
  | 'medical_report'
  | 'disability_certificate'
  | 'vaccination_card'
  | 'photo'
  | 'cv'
  | 'professional_title'
  | 'contract'
  | 'resolution'
  | 'certificate'
  | 'criminal_record'
  | 'minutes'
  | 'report'
  | 'agreement'
  | 'evidence'
  | 'evaluation'
  | 'consent'
  | 'referral'
  | 'plan'
  | 'annex'
  | 'calendar'
  | 'thesis'
  | 'payment_receipt'
  | 'agenda'
  | 'financial_statement'
  | 'attendance_list'
  | 'screenshot'
  | 'other';

// Broad family of a file, for its icon and whether it opens in a tab
export type AttachmentFileKind = 'pdf' | 'image' | 'word' | 'excel' | 'other';

// forbidden: joseph-api answered 403 (the role may open the page but not this owner's files)
export type AttachmentActionResult<T> = { ok: true; data: T; message?: string } | { ok: false; message: string; fields?: Record<string, string>; forbidden?: boolean };

// ---------- joseph-api JSON ----------

export interface HttpAttachment {
  id: string;
  owner_kind: AttachmentOwnerKind;
  owner_id: string;
  category: string;
  title: string;
  description: string;
  file_name: string;
  content_type: string;
  size_bytes: number;
  uploaded_name: string;
  created_at: string;
  can_delete: boolean;
}

export interface HttpAttachmentList {
  attachments: HttpAttachment[];
  can_edit: boolean;
  categories: string[];
  max_files: number;
}

// ---------- actions ----------

export interface GetAttachmentsParams {
  institution: string;
  ownerKind: AttachmentOwnerKind;
  ownerId: string;
}

export interface DeleteAttachmentParams {
  institution: string;
  id: string;
}

// ---------- prepared for the UI ----------

export interface Attachment {
  id: string;
  category: string;
  categoryLabel: string;
  title: string;
  description: string;
  fileName: string;
  contentType: string;
  fileKind: AttachmentFileKind;
  sizeBytes: number;
  sizeLabel: string;
  uploadedName: string;
  createdAt: string;
  createdLabel: string;
  // Same-origin proxy (/api/files/attachments/<id>); opens inline for PDF and images
  url: string;
  // PDF and images open in a new tab; Word and Excel only download
  canPreview: boolean;
  canDelete: boolean;
}

export interface AttachmentCategoryOption {
  value: string;
  label: string;
}

export interface AttachmentFileMeta {
  label: string;
  icon: IconInput;
  className: string;
}

// Files the person picked or dropped, waiting for the category and the "Subir" click
export interface StagedFile {
  key: string;
  file: File;
  fileKind: AttachmentFileKind;
  sizeLabel: string;
}

// What the component hands over raw; the hook validates and builds the FormData
export interface UploadAttachmentsInput {
  files: File[];
  category: string;
  title: string;
}

export interface UseGetAttachmentsParams {
  ownerKind: AttachmentOwnerKind;
  ownerId: string;
  enabled?: boolean;
  // Narrows (and orders) the categories the API allows; omitted → every category the API allows
  categories?: AttachmentCategory[];
}

export interface UseGetAttachmentsResult {
  attachments: Attachment[];
  canEdit: boolean;
  categories: AttachmentCategoryOption[];
  maxFiles: number;
  isLoading: boolean;
  error: string | null;
  // The API refused this person the owner's files (403): the panel hides instead of showing an error
  forbidden: boolean;
  reload: () => void;
}

export interface UseUploadAttachmentsParams {
  ownerKind: AttachmentOwnerKind;
  ownerId: string;
  onUploaded: () => void;
}

export interface UseUploadAttachmentsResult {
  upload: (input: UploadAttachmentsInput) => Promise<boolean>;
  isUploading: boolean;
  error: string | null;
  clearError: () => void;
}

export interface UseDeleteAttachmentParams {
  onDeleted: () => void;
}

export interface UseDeleteAttachmentResult {
  remove: (attachment: Attachment) => void;
  deletingId: string | null;
}

export interface UseAttachmentsPanelParams {
  ownerKind: AttachmentOwnerKind;
  ownerId: string;
  module?: ModuleKey;
  categories?: AttachmentCategory[];
  readOnly: boolean;
}

export interface UseAttachmentsAccessParams {
  ownerKind: AttachmentOwnerKind;
  module?: ModuleKey;
}

export interface UseAttachmentsPanelResult {
  visible: boolean;
  forbidden: boolean;
  attachments: Attachment[];
  categories: AttachmentCategoryOption[];
  maxFiles: number;
  editable: boolean;
  full: boolean;
  isLoading: boolean;
  loadError: string | null;
  reload: () => void;
  // Staging area: files picked or dropped before uploading
  staged: StagedFile[];
  stageError: string | null;
  addFiles: (files: File[]) => void;
  unstage: (key: string) => void;
  clearStaged: () => void;
  category: string;
  setCategory: (value: string) => void;
  title: string;
  setTitle: (value: string) => void;
  submit: () => void;
  canSubmit: boolean;
  isUploading: boolean;
  remove: (attachment: Attachment) => void;
  deletingId: string | null;
}

// ---------- components ----------

export type AttachmentsPanelVariant = 'default' | 'compact';

export interface AttachmentsPanelProps {
  ownerKind: AttachmentOwnerKind;
  ownerId: string;
  // Module whose view permission shows the panel; defaults to the module of the owner kind
  module?: ModuleKey;
  title?: string;
  description?: string;
  categories?: AttachmentCategory[];
  // Hides upload and delete even when the API would allow them
  readOnly?: boolean;
  variant?: AttachmentsPanelVariant;
  className?: string;
  // Shown instead of hiding when the API refuses this person the files (inside a dialog opened on purpose)
  forbiddenNote?: string;
}

// A small "Adjuntos" button for a row or card that opens the panel in a dialog (fetches only when opened)
export interface AttachmentsButtonProps extends Omit<AttachmentsPanelProps, 'variant' | 'className' | 'forbiddenNote' | 'title'> {
  // Dialog title, e.g. "Archivos de la entrevista"
  title?: string;
  label?: string;
  // Square icon button for dense table rows; the label becomes its accessible name
  iconOnly?: boolean;
  className?: string;
}

export interface AttachmentUploaderProps {
  variant: AttachmentsPanelVariant;
  inputId: string;
  staged: StagedFile[];
  stageError: string | null;
  categories: AttachmentCategoryOption[];
  category: string;
  title: string;
  isUploading: boolean;
  canSubmit: boolean;
  remaining: number;
  onAdd: (files: File[]) => void;
  onUnstage: (key: string) => void;
  onClear: () => void;
  onCategory: (value: string) => void;
  onTitle: (value: string) => void;
  onSubmit: () => void;
}

export interface AttachmentItemProps {
  attachment: Attachment;
  variant: AttachmentsPanelVariant;
  editable: boolean;
  isDeleting: boolean;
  onDelete: (attachment: Attachment) => void;
}
