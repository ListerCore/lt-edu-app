'use client';

import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { isClassroomEvent } from '@/hooks/use-live';
import { getLibraryAction } from '../actions/get-library';
import type { LibraryData, RemoteState } from '../types';

// The institution's library; refetches when anyone changes the classroom (live)
export const useGetLibrary = (): RemoteState<LibraryData> => {
  const slug = useInstitutionSlug();
  return useAcademicData(`classroom-library:${slug}`, () => getLibraryAction(slug), isClassroomEvent);
};
