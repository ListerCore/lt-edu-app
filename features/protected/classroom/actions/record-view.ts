'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import { classroomRpc } from '@/lib/api/grpc/classroom';
import type { AcademicResult } from '../types';

// A student opened a piece of material or joined a live session (ClassroomService.RecordView)
export const recordViewAction = async (slug: string, itemId: string): Promise<AcademicResult<null>> =>
  validIds(itemId) ? runRpc(slug, (token) => classroomRpc.recordView({ institutionSlug: slug, itemId }, { token }), () => null) : notFound;
