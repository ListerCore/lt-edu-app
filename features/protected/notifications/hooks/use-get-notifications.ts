'use client';

import { useCallback, useEffect, useState } from 'react';
import { useWorkspace } from '@/features/protected/dashboard/hooks/use-workspace';
import { getNotificationsAction } from '../actions/notification-actions';
import type { AppNotification, UseGetNotificationsResult } from '../types';
import { useNotificationReads } from './use-notification-reads';

// Loads the notifications of the current role (again whenever the role changes) and exposes the unread state
export const useGetNotifications = (): UseGetNotificationsResult => {
  const { role } = useWorkspace();
  const readIds = useNotificationReads();
  const [state, setState] = useState<{ role: string | null; items: AppNotification[]; now: number }>({ role: null, items: [], now: 0 });

  useEffect(() => {
    let active = true;
    void getNotificationsAction(role).then((result) => {
      if (active && result.ok && result.data) setState({ role, items: result.data, now: Date.now() });
    });
    return () => {
      active = false;
    };
  }, [role]);

  const isRead = useCallback((id: string): boolean => readIds.includes(id), [readIds]);
  const notifications = state.role === role ? state.items : [];

  return { notifications, isLoading: state.role !== role, now: state.now, unreadCount: notifications.filter(({ id }) => !readIds.includes(id)).length, isRead };
};
