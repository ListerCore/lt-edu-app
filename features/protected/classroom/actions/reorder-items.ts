'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import { classroomRpc } from '@/lib/api/grpc/classroom';
import type { AcademicResult } from '../types';

// New order of the material of a unit (ClassroomService.ReorderItems)
export const reorderItemsAction = async (slug: string, unitId: string, ids: string[]): Promise<AcademicResult<null>> =>
  validIds(unitId, ...ids) ? runRpc(slug, (token) => classroomRpc.reorderItems({ institutionSlug: slug, unitId, ids }, { token }), () => null) : notFound;
