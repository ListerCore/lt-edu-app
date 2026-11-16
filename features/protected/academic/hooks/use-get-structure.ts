'use client';

import { getStructureAction } from '../actions/academic-actions';
import type { RemoteState, StructureData } from '../types';
import { useAcademicData } from './use-academic-data';
import { useInstitutionSlug } from './use-institution-slug';

// Levels (cycles, areas, programs) with their grades of the workspace institution; refetches on academic changes
export const useGetStructure = (enabled = true): RemoteState<StructureData> => {
  const slug = useInstitutionSlug();
  return useAcademicData(enabled ? `structure:${slug}` : 'structure:off', () => (enabled ? getStructureAction(slug) : Promise.resolve({ ok: false as const, message: '' })));
};
