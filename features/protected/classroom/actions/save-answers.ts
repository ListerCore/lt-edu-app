'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import { classroomRpc } from '@/lib/api/grpc/classroom';
import type { AcademicResult, Answer } from '../types';

// Keeps the answers of an attempt in progress (ClassroomService.SaveAnswers)
export const saveAnswersAction = async (slug: string, submissionId: string, answers: Record<string, Answer>): Promise<AcademicResult<null>> =>
  validIds(submissionId) ? runRpc(slug, (token) => classroomRpc.saveAnswers({ institutionSlug: slug, submissionId, answers }, { token }), () => null) : notFound;
