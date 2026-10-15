import type { LucideIcon } from 'lucide-react';

export interface ProfileField {
  label: string;
  value: string;
  verified?: boolean;
}

export interface ProfileSectionLink {
  label: string;
  tab: ProfileTab;
  icon: LucideIcon;
}

export type ProfileTab = 'general' | 'personal' | 'institutional' | 'security' | 'notifications' | 'activity';

export interface ProfileChecklistItem {
  label: string;
  complete: boolean;
}

export interface ProfileActivityItem {
  title: string;
  description: string;
  time: string;
  icon: LucideIcon;
}
