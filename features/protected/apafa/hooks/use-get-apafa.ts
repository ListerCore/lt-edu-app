'use client';

import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { isApafaEvent } from '@/hooks/use-live';
import { getApafaAction } from '../actions/get-apafa';
import type { UseGetApafaResult } from '../types';

// Meetings, board and fee collection of the workspace institution; refetches when anyone changes the APAFA (live)
export const useGetApafa = (): UseGetApafaResult => {
  const slug = useInstitutionSlug();
  return useAcademicData(`apafa:${slug}`, () => getApafaAction(slug), isApafaEvent);
};
