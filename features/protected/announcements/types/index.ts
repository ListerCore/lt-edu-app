import type { IconInput } from 'morphicons/react';

// Announcement = general news, notice = official communication, alert = something that needs action or attention
export type AnnouncementKind = 'announcement' | 'notice' | 'alert';

export type AnnouncementAudience = 'community' | 'students' | 'guardians' | 'staff';

// image (PNG, JPG, WebP; the first one is the cover) or document (PDF)
export type AttachmentKind = 'image' | 'document';

export interface AnnouncementAttachment {
  id: string;
  kind: AttachmentKind;
  fileName: string;
  contentType: string;
  sizeBytes: number;
  // Relayed by the site (/api/files/...); internal announcements only open for people allowed to read them
  url: string;
}

export interface Announcement {
  id: string;
  // 18 characters of [a-z0-9]: the public address /news/<slug>
  slug: string;
  kind: AnnouncementKind;
  title: string;
  body: string;
  audience: AnnouncementAudience;
  // ISO date-time it was published
  publishedAt: string;
  // Shown on the public /news page; otherwise only inside the panel
  isPublic: boolean;
  pinned: boolean;
  authorName: string;
  updatedAt: string;
  // Validity window of the home modal (null: not featured)
  featuredFrom: string | null;
  featuredUntil: string | null;
  // Button of the modal and where it leads (empty: the announcement's own page)
  ctaLabel: CtaLabel | '';
  ctaUrl: string;
  attachments: AnnouncementAttachment[];
}

export type CtaLabel = 'Ir' | 'Continuar';

export interface KindMeta {
  label: string;
  plural: string;
  icon: IconInput;
  className: string;
}

// A file picked in the form, before publishing
export interface DraftFile {
  key: string;
  file: File;
  kind: AttachmentKind;
  // Object URL of an image, for its thumbnail
  previewUrl: string | null;
}

export interface AnnouncementDraft {
  kind: AnnouncementKind;
  title: string;
  body: string;
  audience: AnnouncementAudience;
  isPublic: boolean;
  // Validity window, as <input type="datetime-local"> values in the browser's time zone
  featured: boolean;
  featuredFrom: string;
  featuredUntil: string;
  ctaLabel: CtaLabel;
  ctaUrl: string;
  // Editing: attachments already stored that stay, in order
  kept: AnnouncementAttachment[];
  files: DraftFile[];
}

export interface AnnouncementActionResult<T> {
  ok: boolean;
  message: string;
  fields?: Record<string, string>;
  data?: T;
}

export interface AnnouncementFeed {
  announcements: Announcement[];
  canPublish: boolean;
}

export interface UseGetAnnouncementsResult {
  announcements: Announcement[];
  canPublish: boolean;
  isLoading: boolean;
}

export type DraftErrors = Partial<Record<'title' | 'body' | 'files' | 'kind' | 'audience' | 'featured_from' | 'featured_until' | 'cta_label' | 'cta_url', string>>;

// Text fields of the draft (files and kept attachments have their own setters)
export type DraftField = Exclude<keyof AnnouncementDraft, 'files' | 'kept'>;

export interface UseAnnouncementFormResult {
  values: AnnouncementDraft;
  errors: DraftErrors;
  isPending: boolean;
  setField: <K extends DraftField>(field: K, value: AnnouncementDraft[K]) => void;
  addFiles: (files: File[]) => void;
  removeFile: (key: string) => void;
  removeKept: (id: string) => void;
  submit: () => void;
}

export interface AnnouncementFilesDropzoneProps {
  // Stored attachments that stay (editing)
  kept?: AnnouncementAttachment[];
  onRemoveKept?: (id: string) => void;
  files: DraftFile[];
  error?: string;
  disabled?: boolean;
  onAdd: (files: File[]) => void;
  onRemove: (key: string) => void;
}

// panel: the title opens /dashboard/announcements/<slug>; public: /news/<slug>. Both offer "Ver publicación" for
// public announcements
export type AnnouncementContext = 'panel' | 'public';

export interface AnnouncementCardProps {
  announcement: Announcement;
  context: AnnouncementContext;
}

export interface AnnouncementTabsProps {
  announcements: Announcement[];
  isLoading?: boolean;
  emptyText: string;
  context: AnnouncementContext;
}

export interface AnnouncementFormProps {
  // Editing: the announcement as stored; creating: undefined
  announcement?: Announcement;
  onSaved: (announcement: Announcement) => void;
  onCancel: () => void;
}

export interface AnnouncementDetail {
  announcement: Announcement;
  canEdit: boolean;
}

export interface UseAnnouncementDetailResult {
  detail: AnnouncementDetail | null;
  error: string | null;
  isLoading: boolean;
  isDeleting: boolean;
  replace: (announcement: Announcement) => void;
  remove: () => void;
}

export interface AnnouncementDetailPageProps {
  slug: string;
}

export interface FeaturedAnnouncementsModalProps {
  announcements: Announcement[];
}

export interface AttachmentThumbProps {
  attachment: AnnouncementAttachment;
  onOpen: () => void;
  className?: string;
}

export interface AnnouncementAttachmentsProps {
  attachments: AnnouncementAttachment[];
  // Leaves out the cover image (already shown above the card)
  skipCover?: boolean;
  layout?: 'strip' | 'grid';
}

export interface AttachmentPreviewDialogProps {
  attachment: AnnouncementAttachment | null;
  onClose: () => void;
}
