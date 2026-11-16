'use client';

import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { isInstitutionEvent } from '@/hooks/use-live';
import { getMembersAction } from '../actions/get-members';
import type { MembersData, RemoteState } from '../types';

// Staff accesses of the workspace institution; refetches when anyone grants or revokes one (live)
export const useGetMembers = (): RemoteState<MembersData> => {
  const slug = useInstitutionSlug();
  return useAcademicData(`members:${slug}`, () => getMembersAction(slug), isInstitutionEvent);
};
