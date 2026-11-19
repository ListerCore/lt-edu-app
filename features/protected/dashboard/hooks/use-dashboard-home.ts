'use client';

import { useCallback, useMemo } from 'react';
import { sortAnnouncements } from '@/features/protected/announcements/data/announcements-data';
import { useGetAnnouncements } from '@/features/protected/announcements/hooks/use-get-announcements';
import { useToday } from '@/features/protected/academic/hooks/use-today';
import { useGetNotifications } from '@/features/protected/notifications/hooks/use-get-notifications';
import { useMarkNotificationsRead } from '@/features/protected/notifications/hooks/use-mark-notifications-read';
import { DASHBOARD_PATH } from '../data/dashboard-navigation';
import type { ResolvedLeaf, UseDashboardHomeResult } from '../types';
import { useDashboardNavigation } from './use-dashboard-navigation';
import { useWorkspace } from './use-workspace';

// How many items each home block shows before sending people to the full module
const MAX_SHORTCUTS = 8;
const MAX_ANNOUNCEMENTS = 3;
const MAX_NOTIFICATIONS = 5;

// "miércoles, 18 de noviembre" in Lima time; noon keeps the calendar day from shifting with the offset
const todayFormat = new Intl.DateTimeFormat('es-PE', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'America/Lima' });
const formatToday = (iso: string): string => {
  if (!iso) return '';
  const label = todayFormat.format(new Date(`${iso}T12:00:00-05:00`));
  // es-PE writes the weekday in lowercase; the home shows it as a sentence start
  return label.charAt(0).toUpperCase() + label.slice(1);
};

// Combines workspace, navigation, announcements and notifications into the data the home renders
export const useDashboardHome = (): UseDashboardHomeResult => {
  const { userName, roleLabel, institutionName, institutionTypeLabel, can } = useWorkspace();
  const sections = useDashboardNavigation();
  const { announcements, isLoading: isLoadingAnnouncements } = useGetAnnouncements();
  const { notifications, isLoading: isLoadingNotifications, unreadCount, now, isRead } = useGetNotifications();
  const { markRead: markManyRead } = useMarkNotificationsRead();
  const today = useToday();

  // Shortcuts follow the sidebar order: groups contribute their leaves, and Inicio itself is skipped
  const shortcuts = useMemo(
    (): ResolvedLeaf[] =>
      sections
        .flatMap(({ items }) => items.flatMap((item): ResolvedLeaf[] => (item.children.length > 0 ? item.children : item.href ? [{ label: item.label, href: item.href, icon: item.icon }] : [])))
        .filter(({ href }) => href !== DASHBOARD_PATH)
        .slice(0, MAX_SHORTCUTS),
    [sections],
  );

  const showAnnouncements = can('announcements');
  // Pinned first, then newest, like the announcements module
  const latestAnnouncements = useMemo(() => (showAnnouncements ? sortAnnouncements(announcements).slice(0, MAX_ANNOUNCEMENTS) : []), [announcements, showAnnouncements]);

  // The feed arrives in seed order; the home shows the newest ones
  const latestNotifications = useMemo(() => [...notifications].sort((a, b) => b.createdAt - a.createdAt).slice(0, MAX_NOTIFICATIONS), [notifications]);

  const markRead = useCallback((id: string): void => markManyRead([id]), [markManyRead]);

  return {
    firstName: userName.split(' ')[0],
    roleLabel,
    institutionName,
    institutionTypeLabel,
    todayLabel: formatToday(today),
    shortcuts,
    showAnnouncements,
    announcements: latestAnnouncements,
    isLoadingAnnouncements,
    notifications: latestNotifications,
    isLoadingNotifications,
    unreadCount,
    now,
    isRead,
    markRead,
  };
};
