'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import { participationRpc } from '@/lib/api/grpc/participation';
import type { AcademicResult, RoomParticipation } from '../types';

// What each student of a room's grade did in it (ParticipationService.GetRoomParticipation)
export const getRoomParticipationAction = async (slug: string, roomId: string): Promise<AcademicResult<RoomParticipation[]>> =>
  validIds(roomId) ? runRpc(slug, (token) => participationRpc.room({ institutionSlug: slug, roomId }, { token }), (d) => d.students) : notFound;
