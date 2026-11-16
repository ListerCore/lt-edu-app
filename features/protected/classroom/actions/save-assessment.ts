'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import { classroomRpc } from '@/lib/api/grpc/classroom';
import type { AcademicResult, Assessment, AssessmentPayload } from '../types';

// Window, attempts, competencies and, for a quiz, the questions (ClassroomService.SaveAssessment)
export const saveAssessmentAction = async (slug: string, p: AssessmentPayload): Promise<AcademicResult<Assessment>> =>
  validIds(p.itemId, ...p.competencyIds)
    ? runRpc(slug, (token) => classroomRpc.saveAssessment({ institutionSlug: slug, ...p }, { token }), (d) => d.assessment, 'Evaluación guardada.')
    : notFound;
