'use client';

import { useEffect, useState } from 'react';
import { sileo } from 'sileo';
import { isAnnouncementEvent, useLiveRefresh } from '@/hooks/use-live';
import { getAnnouncementsAction } from '../actions/announcement-actions';
import type { Announcement, UseGetAnnouncementsResult } from '../types';

interface FeedState {
  announcements: Announcement[];
  canPublish: boolean;
  isLoading: boolean;
}

// Panel feed (gRPC through a server action), refetched whenever an announcement is published, edited or deleted
export const useGetAnnouncements = (): UseGetAnnouncementsResult => {
  const [state, setState] = useState<FeedState>({ announcements: [], canPublish: false, isLoading: true });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let active = true;
    void getAnnouncementsAction().then((result) => {
      if (!active) return;
      if (result.ok && result.data) setState({ announcements: result.data.announcements, canPublish: result.data.canPublish, isLoading: false });
      else {
        setState((current) => ({ ...current, isLoading: false }));
        sileo.error({ title: 'No se cargaron los comunicados', description: result.message });
      }
    });
    return () => {
      active = false;
    };
  }, [version]);

  useLiveRefresh(
    (event) => isAnnouncementEvent(event.type),
    () => setVersion((current) => current + 1),
  );

  return state;
};
