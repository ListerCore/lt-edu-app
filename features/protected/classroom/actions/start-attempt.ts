'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import { classroomRpc } from '@/lib/api/grpc/classroom';
import type { AcademicResult, Submission } from '../types';

// Opens (or continues) the student's attempt (ClassroomService.StartAttempt)
export const startAttemptAction = async (slug: string, itemId: string): Promise<AcademicResult<Submission>> =>
  validIds(itemId) ? runRpc(slug, (token) => classroomRpc.startAttempt({ institutionSlug: slug, itemId }, { token }), (d) => d.submission) : notFound;
