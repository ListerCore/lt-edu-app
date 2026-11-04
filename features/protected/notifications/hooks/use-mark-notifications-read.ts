'use client';

import { useCallback, useTransition } from 'react';
import { markNotificationsReadAction } from '../actions/notification-actions';
import type { UseMarkNotificationsReadResult } from '../types';
import { addReadIds } from './use-notification-reads';

// Marks notifications as read: the UI updates at once and the (simulated) action confirms in the background
export const useMarkNotificationsRead = (): UseMarkNotificationsReadResult => {
  const [isPending, startTransition] = useTransition();

  const markRead = useCallback((ids: string[]): void => {
    if (ids.length === 0) return;
    addReadIds(ids);
    startTransition(async (): Promise<void> => {
      await markNotificationsReadAction(ids);
    });
  }, []);

  return { markRead, isPending };
};
