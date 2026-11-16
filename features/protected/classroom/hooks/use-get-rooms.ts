'use client';

import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { isClassroomEvent } from '@/hooks/use-live';
import { getRoomsAction } from '../actions/get-rooms';
import type { CatalogData, RemoteState } from '../types';

// Rooms of a period (empty: the one in course); refetches when anyone changes the classroom (live)
export const useGetRooms = (periodId: string): RemoteState<CatalogData> => {
  const slug = useInstitutionSlug();
  return useAcademicData(`classroom-rooms:${slug}:${periodId}`, () => getRoomsAction(slug, periodId), isClassroomEvent);
};
