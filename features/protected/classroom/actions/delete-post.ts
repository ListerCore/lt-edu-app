'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import { classroomRpc } from '@/lib/api/grpc/classroom';
import type { AcademicResult } from '../types';

// Removes one's own post while it has no replies (ClassroomService.DeletePost)
export const deletePostAction = async (slug: string, id: string): Promise<AcademicResult<null>> =>
  validIds(id) ? runRpc(slug, (token) => classroomRpc.deletePost({ institutionSlug: slug, id }, { token }), () => null, 'Mensaje eliminado.') : notFound;
