'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import { classroomRpc } from '@/lib/api/grpc/classroom';
import type { AcademicResult } from '../types';

// Kind of forum and whether it is closed (ClassroomService.SaveForum)
export const saveForumAction = async (slug: string, itemId: string, kind: string, closed: boolean): Promise<AcademicResult<null>> =>
  validIds(itemId) ? runRpc(slug, (token) => classroomRpc.saveForum({ institutionSlug: slug, itemId, kind, closed }, { token }), () => null) : notFound;
