'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import { classroomRpc } from '@/lib/api/grpc/classroom';
import type { AcademicResult } from '../types';

// Changes the text of one's own post (ClassroomService.EditPost)
export const editPostAction = async (slug: string, id: string, body: string): Promise<AcademicResult<null>> =>
  validIds(id) ? runRpc(slug, (token) => classroomRpc.editPost({ institutionSlug: slug, id, body }, { token }), () => null, 'Mensaje editado.') : notFound;
