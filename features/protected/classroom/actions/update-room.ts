'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import { classroomRpc } from '@/lib/api/grpc/classroom';
import type { AcademicResult, Room } from '../types';

// Description and publication of a room; the teacher in charge is kept (ClassroomService.UpdateRoom)
export const updateRoomAction = async (slug: string, room: Room, description: string, status: string): Promise<AcademicResult<Room>> =>
  validIds(room.id)
    ? runRpc(
        slug,
        (token) => classroomRpc.updateRoom({ institutionSlug: slug, id: room.id, description, status, staffId: room.staffId }, { token }),
        (d) => d.room,
        status === 'published' ? 'Aula guardada y visible para los estudiantes.' : 'Aula guardada como borrador.',
      )
    : notFound;
