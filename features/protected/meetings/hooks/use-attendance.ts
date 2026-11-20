'use client';

import { useEffect } from 'react';
import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import type { RemoteState } from '@/features/protected/academic/types';
import { getAttendanceAction } from '../actions/get-attendance';
import type { Attendee } from '../types';

const REFRESH_MS = 30_000;

// Who joined the session (hosts only), refreshed every 30 seconds while the call is open
export const useAttendance = (slug: string, source: string, id: string, enabled: boolean): RemoteState<Attendee[]> => {
  const state = useAcademicData(
    `live-attendance:${slug}:${source}:${id}:${enabled}`,
    async () => (enabled ? getAttendanceAction(slug, source, id) : { ok: true as const, data: [] }),
    () => false,
  );
  const { reload } = state;
  useEffect(() => {
    if (!enabled) return;
    const timer = setInterval(reload, REFRESH_MS);
    return () => clearInterval(timer);
  }, [enabled, reload]);
  return state;
};
