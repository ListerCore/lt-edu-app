'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import { classroomRpc } from '@/lib/api/grpc/classroom';
import type { AcademicResult, RoomData } from '../types';

// One room with its units and material (ClassroomService.GetRoom)
export const getRoomAction = async (slug: string, id: string): Promise<AcademicResult<RoomData>> =>
  validIds(id)
    ? runRpc(
        slug,
        (token) => classroomRpc.room({ institutionSlug: slug, id }, { token }),
        (d) => (d.room ? { room: d.room, units: d.units, canEdit: d.canEdit, family: d.family } : undefined),
      )
    : notFound;
