'use client';

import { useMemo } from 'react';
import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { isApafaEvent } from '@/hooks/use-live';
import { getMeetingAction } from '../actions/get-meeting';
import { toMeetingView } from '../data/apafa-data';
import type { UseGetMeetingResult } from '../types';
import { useNow } from './use-now';

// One meeting, labelled for the detail page; refetches live when it (or any APAFA data) changes
export const useGetMeeting = (id: string): UseGetMeetingResult => {
  const slug = useInstitutionSlug();
  const { data, error, isLoading, reload } = useAcademicData(`apafa-meeting:${slug}:${id}`, () => getMeetingAction(slug, id), isApafaEvent);
  const now = useNow();
  const meeting = useMemo(() => (data ? toMeetingView(data.meeting, now) : null), [data, now]);
  return { meeting, canManage: data?.canManage ?? false, error, isLoading, reload };
};
