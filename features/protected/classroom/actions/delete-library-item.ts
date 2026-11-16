'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import { classroomRpc } from '@/lib/api/grpc/classroom';
import type { AcademicResult } from '../types';

// Removes a library entry nobody uses (ClassroomService.DeleteLibraryItem)
export const deleteLibraryItemAction = async (slug: string, id: string): Promise<AcademicResult<null>> =>
  validIds(id) ? runRpc(slug, (token) => classroomRpc.deleteLibraryItem({ institutionSlug: slug, id }, { token }), () => null, 'Recurso eliminado.') : notFound;
