'use client';

import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { isInstitutionEvent } from '@/hooks/use-live';
import { getInstitutionFileAction } from '../actions/get-institution-file';
import type { InstitutionFileData, RemoteState } from '../types';

// Authorizations and platform sheet of the workspace institution; refetches when anyone changes them (live)
export const useGetInstitutionFile = (): RemoteState<InstitutionFileData> => {
  const slug = useInstitutionSlug();
  return useAcademicData(`institution-file:${slug}`, () => getInstitutionFileAction(slug), isInstitutionEvent);
};
