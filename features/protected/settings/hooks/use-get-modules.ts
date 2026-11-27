'use client';

import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { isInstitutionEvent } from '@/hooks/use-live';
import { getModulesAction } from '../actions/get-modules';
import type { ModulesData, RemoteState } from '../types';

// Optional modules of the workspace institution; refetches when dirección switches one (live)
export const useGetModules = (): RemoteState<ModulesData> => {
  const slug = useInstitutionSlug();
  return useAcademicData(`modules:${slug}`, () => getModulesAction(slug), isInstitutionEvent);
};
