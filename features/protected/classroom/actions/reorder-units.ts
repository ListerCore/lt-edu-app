'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import { classroomRpc } from '@/lib/api/grpc/classroom';
import type { AcademicResult } from '../types';

// New order of the units of a room (ClassroomService.ReorderUnits)
export const reorderUnitsAction = async (slug: string, roomId: string, ids: string[]): Promise<AcademicResult<null>> =>
  validIds(roomId, ...ids) ? runRpc(slug, (token) => classroomRpc.reorderUnits({ institutionSlug: slug, roomId, ids }, { token }), () => null) : notFound;
