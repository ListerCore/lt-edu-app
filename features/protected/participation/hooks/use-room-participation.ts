'use client';

import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { isClassroomEvent } from '@/hooks/use-live';
import { getRoomParticipationAction } from '../actions/get-room-participation';
import type { RemoteState, RoomParticipation } from '../types';

// What each student did in a classroom room; refetches when the classroom changes
export const useRoomParticipation = (roomId: string): RemoteState<RoomParticipation[]> => {
  const slug = useInstitutionSlug();
  return useAcademicData(`room-participation:${slug}:${roomId}`, () => getRoomParticipationAction(slug, roomId), isClassroomEvent);
};
