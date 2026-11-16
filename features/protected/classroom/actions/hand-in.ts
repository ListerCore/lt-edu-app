'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import { classroomRpc } from '@/lib/api/grpc/classroom';
import type { AcademicResult, Answer, Submission } from '../types';

// Hands in the attempt with its last answers (ClassroomService.HandIn)
export const handInAction = async (slug: string, submissionId: string, answers: Record<string, Answer>): Promise<AcademicResult<Submission>> =>
  validIds(submissionId)
    ? runRpc(slug, (token) => classroomRpc.handIn({ institutionSlug: slug, submissionId, answers }, { token }), (d) => d.submission, 'Entregado. Tu docente lo revisará.')
    : notFound;
