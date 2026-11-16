'use client';

import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { isAttendanceEvent } from '@/hooks/use-live';
import { getPermanenceBoardAction } from '../actions/get-permanence-board';
import type { PermanenceBoard, RemoteState } from '../types';

// The rule and the distance sections of the period in course
export const usePermanenceBoard = (): RemoteState<PermanenceBoard> => {
  const slug = useInstitutionSlug();
  return useAcademicData(`permanence-board:${slug}`, () => getPermanenceBoardAction(slug), isAttendanceEvent);
};
