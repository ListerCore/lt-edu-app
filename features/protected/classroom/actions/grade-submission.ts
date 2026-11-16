'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import { classroomRpc } from '@/lib/api/grpc/classroom';
import type { AcademicResult, Submission } from '../types';

// The teacher's levels, open-question points and feedback (ClassroomService.GradeSubmission)
export const gradeSubmissionAction = async (slug: string, submissionId: string, levels: Record<string, string>, openPoints: Record<string, number>, feedback: string): Promise<AcademicResult<Submission>> =>
  validIds(submissionId)
    ? runRpc(slug, (token) => classroomRpc.gradeSubmission({ institutionSlug: slug, submissionId, levels, openPoints, feedback }, { token }), (d) => d.submission, 'Calificación guardada.')
    : notFound;
