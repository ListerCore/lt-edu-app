import type { IconInput } from 'morphicons/react';

// Announcement = general news, notice = official communication, alert = something that needs action or attention
export type AnnouncementKind = 'announcement' | 'notice' | 'alert';

export type AnnouncementAudience = 'community' | 'students' | 'guardians' | 'staff';

export interface Announcement {
  id: string;
  kind: AnnouncementKind;
  title: string;
  summary: string;
  audience: AnnouncementAudience;
  // ISO date (YYYY-MM-DD) it was published
  publishedAt: string;
  // Shown on the public /news page; otherwise only inside the panel
  isPublic: boolean;
  pinned: boolean;
  // Optional cover image
  imageUrl?: string | null;
}

export interface KindMeta {
  label: string;
  plural: string;
  icon: IconInput;
  className: string;
}

export interface AnnouncementDraft {
  kind: AnnouncementKind;
  title: string;
  summary: string;
  audience: AnnouncementAudience;
  isPublic: boolean;
  // Local preview URL while simulated; becomes the stored image URL once joseph-api handles uploads
  imageUrl: string | null;
}

export interface AnnouncementActionResult<T> {
  ok: boolean;
  message: string;
  data?: T;
}

export interface UseGetAnnouncementsResult {
  announcements: Announcement[];
  isLoading: boolean;
  // Puts a just-created announcement at the top without refetching
  prepend: (announcement: Announcement) => void;
}

export interface UseCreateAnnouncementResult {
  values: AnnouncementDraft;
  errors: Partial<Record<'title' | 'summary' | 'image', string>>;
  isPending: boolean;
  setField: <K extends keyof AnnouncementDraft>(field: K, value: AnnouncementDraft[K]) => void;
  setImage: (file: File) => void;
  removeImage: () => void;
  submit: () => void;
  reset: () => void;
}

export interface AnnouncementImageDropzoneProps {
  imageUrl: string | null;
  error?: string;
  disabled?: boolean;
  onSelect: (file: File) => void;
  onRemove: () => void;
}

export interface AnnouncementCardProps {
  announcement: Announcement;
}

export interface AnnouncementTabsProps {
  announcements: Announcement[];
  isLoading?: boolean;
  emptyText: string;
}

export interface AnnouncementFormDialogProps {
  onCreated: (announcement: Announcement) => void;
}
