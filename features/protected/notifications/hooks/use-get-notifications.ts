'use client';

import { useCallback, useEffect, useState } from 'react';
import { useWorkspace } from '@/features/protected/dashboard/hooks/use-workspace';
import { getNotificationsAction } from '../actions/notification-actions';
import type { AppNotification, UseGetNotificationsResult } from '../types';
import { useNotificationReads } from './use-notification-reads';

// Loads the notifications of the current role and management type (again whenever either changes) and exposes the
// unread state
export const useGetNotifications = (): UseGetNotificationsResult => {
  const { role, management } = useWorkspace();
  const readIds = useNotificationReads();
  // key ties the loaded items to the role + management they were asked for
  const key = `${role}:${management}`;
  const [state, setState] = useState<{ key: string | null; items: AppNotification[]; now: number }>({ key: null, items: [], now: 0 });

  useEffect(() => {
    let active = true;
    void getNotificationsAction(role, management).then((result) => {
      if (active && result.ok && result.data) setState({ key: `${role}:${management}`, items: result.data, now: Date.now() });
    });
    return () => {
      active = false;
    };
  }, [role, management]);

  const isRead = useCallback((id: string): boolean => readIds.includes(id), [readIds]);
  const notifications = state.key === key ? state.items : [];

  return { notifications, isLoading: state.key !== key, now: state.now, unreadCount: notifications.filter(({ id }) => !readIds.includes(id)).length, isRead };
};
