'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import { classroomRpc } from '@/lib/api/grpc/classroom';
import type { AcademicResult } from '../types';

// Removes an empty unit (ClassroomService.DeleteUnit)
export const deleteUnitAction = async (slug: string, id: string): Promise<AcademicResult<null>> =>
  validIds(id) ? runRpc(slug, (token) => classroomRpc.deleteUnit({ institutionSlug: slug, id }, { token }), () => null, 'Unidad eliminada.') : notFound;
