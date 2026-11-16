'use client';

import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { isClassroomEvent } from '@/hooks/use-live';
import { getAssessmentAction } from '../actions/get-assessment';
import type { AssessmentData, RemoteState } from '../types';

// A quiz or task; refetches when anyone changes the classroom (a hand-in, a grade)
export const useGetAssessment = (itemId: string): RemoteState<AssessmentData> => {
  const slug = useInstitutionSlug();
  return useAcademicData(`classroom-assessment:${slug}:${itemId}`, () => getAssessmentAction(slug, itemId), isClassroomEvent);
};
