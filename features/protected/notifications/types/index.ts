import type { IconInput } from 'morphicons/react';
import type { Management, Role } from '@/features/protected/dashboard/types';

export type NotificationKind = 'announcement' | 'grade' | 'attendance' | 'payment' | 'enrollment' | 'wellbeing' | 'card' | 'apafa' | 'system';

// Demo record: the age is relative so the timeline always looks current
export interface NotificationSeed {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  minutesAgo: number;
  href: string;
  // Roles that receive it; omitted means everyone
  roles?: Role[];
  // Only institutions of this management type get it (tuition reminders are private-only); omitted means both
  management?: Management;
}

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  // Epoch milliseconds
  createdAt: number;
  href: string;
}

export interface NotificationKindMeta {
  label: string;
  icon: IconInput;
  className: string;
}

export interface NotificationActionResult<T> {
  ok: boolean;
  message: string;
  data?: T;
}

export interface TimelineGroup {
  label: string;
  items: AppNotification[];
}

export interface UseGetNotificationsResult {
  notifications: AppNotification[];
  isLoading: boolean;
  // Reference time for relative labels, taken when the list arrived (never during render)
  now: number;
  unreadCount: number;
  isRead: (id: string) => boolean;
}

export interface UseMarkNotificationsReadResult {
  markRead: (ids: string[]) => void;
  isPending: boolean;
}

export type NotificationFilter = 'all' | 'unread';

export interface NotificationTimelineProps {
  groups: TimelineGroup[];
  now: number;
  isRead: (id: string) => boolean;
  onOpen: (id: string) => void;
}
