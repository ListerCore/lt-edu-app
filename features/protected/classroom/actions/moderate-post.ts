'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import { classroomRpc } from '@/lib/api/grpc/classroom';
import type { AcademicResult } from '../types';

// Pins a thread, or hides or shows a post with a reason (ClassroomService.ModeratePost)
export const moderatePostAction = async (slug: string, id: string, pinned: boolean, hidden: boolean, reason: string): Promise<AcademicResult<null>> =>
  validIds(id) ? runRpc(slug, (token) => classroomRpc.moderatePost({ institutionSlug: slug, id, pinned, hidden, reason }, { token }), () => null) : notFound;
