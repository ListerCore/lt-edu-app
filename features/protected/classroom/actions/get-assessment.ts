'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import { classroomRpc } from '@/lib/api/grpc/classroom';
import type { AcademicResult, AssessmentData } from '../types';

// A quiz or task as the person sees it (ClassroomService.GetAssessment)
export const getAssessmentAction = async (slug: string, itemId: string): Promise<AcademicResult<AssessmentData>> =>
  validIds(itemId)
    ? runRpc(
        slug,
        (token) => classroomRpc.assessment({ institutionSlug: slug, itemId }, { token }),
        (d) => (d.assessment ? { ...d, assessment: d.assessment } : undefined),
      )
    : notFound;
