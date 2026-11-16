'use client';

import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { isClassroomEvent } from '@/hooks/use-live';
import { getRoomAction } from '../actions/get-room';
import type { RemoteState, RoomData } from '../types';

// One room with its units and material; refetches when anyone changes the classroom (live)
export const useGetRoom = (id: string): RemoteState<RoomData> => {
  const slug = useInstitutionSlug();
  return useAcademicData(`classroom-room:${slug}:${id}`, () => getRoomAction(slug, id), isClassroomEvent);
};
