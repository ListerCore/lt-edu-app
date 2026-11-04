'use client';

import { useCallback, useEffect, useState } from 'react';
import { sileo } from 'sileo';
import { getAnnouncementsAction } from '../actions/announcement-actions';
import type { Announcement, UseGetAnnouncementsResult } from '../types';

// Loads the panel feed once on mount
export const useGetAnnouncements = (): UseGetAnnouncementsResult => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void getAnnouncementsAction().then((result) => {
      if (!active) return;
      if (result.ok && result.data) setAnnouncements(result.data);
      else sileo.error({ title: 'No se cargaron los comunicados', description: result.message });
      setIsLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const prepend = useCallback((announcement: Announcement): void => setAnnouncements((current) => [announcement, ...current]), []);

  return { announcements, isLoading, prepend };
};
