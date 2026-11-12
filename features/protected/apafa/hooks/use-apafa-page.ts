'use client';

import { useMemo } from 'react';
import { useToday } from '@/features/protected/academic/hooks/use-today';
import { useWorkspace } from '@/features/protected/dashboard/hooks/use-workspace';
import { toBoardView, toFeesView, toMeetingView } from '../data/apafa-data';
import type { MeetingView, UseApafaPageResult } from '../types';
import { useGetApafa } from './use-get-apafa';
import { useNow } from './use-now';

// Everything the APAFA page shows: meetings split into upcoming (soonest first) and past (newest first), the board
// and the fee collection, already labelled
export const useApafaPage = (): UseApafaPageResult => {
  const { data, error, isLoading, reload } = useGetApafa();
  const { role } = useWorkspace();
  const now = useNow();
  const today = useToday();

  const meetings = useMemo((): MeetingView[] => (data?.meetings ?? []).map((m) => toMeetingView(m, now)), [data?.meetings, now]);

  // Open meetings stay "upcoming" until their acta is recorded, even when their time has passed
  const upcoming = useMemo((): MeetingView[] => meetings.filter((m) => m.isOpen).sort((a, b) => Date.parse(a.raw.scheduledAt) - Date.parse(b.raw.scheduledAt)), [meetings]);
  const past = useMemo((): MeetingView[] => meetings.filter((m) => !m.isOpen), [meetings]);
  const board = useMemo(() => (data?.board ?? []).map((b) => toBoardView(b, today)), [data?.board, today]);

  return {
    isLoading,
    error,
    reload,
    canManage: data?.canManage ?? false,
    isFamily: role === 'guardian' || role === 'student',
    upcoming,
    past,
    pendingMinutes: upcoming.filter((m) => m.isDue).length,
    board,
    fees: data?.fees ? toFeesView(data.fees) : null,
  };
};
