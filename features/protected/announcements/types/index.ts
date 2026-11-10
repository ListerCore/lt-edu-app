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
  attachments: AnnouncementAttachment[];
}

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
  // Puts a just-created announcement at the top without waiting for the live refresh
  prepend: (announcement: Announcement) => void;
}

export type DraftErrors = Partial<Record<'title' | 'body' | 'files' | 'kind' | 'audience', string>>;

export interface UseCreateAnnouncementResult {
  values: AnnouncementDraft;
  errors: DraftErrors;
  isPending: boolean;
  setField: <K extends Exclude<keyof AnnouncementDraft, 'files'>>(field: K, value: AnnouncementDraft[K]) => void;
  addFiles: (files: File[]) => void;
  removeFile: (key: string) => void;
  submit: () => void;
  reset: () => void;
}

export interface AnnouncementFilesDropzoneProps {
  files: DraftFile[];
  error?: string;
  disabled?: boolean;
  onAdd: (files: File[]) => void;
  onRemove: (key: string) => void;
}

export interface AnnouncementCardProps {
  announcement: Announcement;
  // Title links to /news/<slug> (public announcements only)
  linkToDetail?: boolean;
}

export interface AnnouncementTabsProps {
  announcements: Announcement[];
  isLoading?: boolean;
  emptyText: string;
  linkToDetail?: boolean;
}

export interface AnnouncementFormDialogProps {
  onCreated: (announcement: Announcement) => void;
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
