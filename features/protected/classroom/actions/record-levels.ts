'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import { classroomRpc } from '@/lib/api/grpc/classroom';
import type { AcademicResult } from '../types';

// Takes the graded levels to the official record of the open term (ClassroomService.RecordLevels)
export const recordLevelsAction = async (slug: string, itemId: string): Promise<AcademicResult<{ recorded: number; skipped: number }>> =>
  validIds(itemId)
    ? runRpc(slug, (token) => classroomRpc.recordLevels({ institutionSlug: slug, itemId }, { token }), (d) => ({ recorded: d.recorded, skipped: d.skippedStudentIds.length }))
    : notFound;
