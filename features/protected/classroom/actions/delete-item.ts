'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import { classroomRpc } from '@/lib/api/grpc/classroom';
import type { AcademicResult } from '../types';

// Removes a piece of material without files of its own (ClassroomService.DeleteItem)
export const deleteItemAction = async (slug: string, id: string): Promise<AcademicResult<null>> =>
  validIds(id) ? runRpc(slug, (token) => classroomRpc.deleteItem({ institutionSlug: slug, id }, { token }), () => null, 'Material eliminado.') : notFound;
