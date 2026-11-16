'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import { participationRpc } from '@/lib/api/grpc/participation';
import type { AcademicResult } from '../types';

// The tutor marks a week present or absent with a reason, or removes the adjustment (ParticipationService.AdjustPermanence)
export const adjustPermanenceAction = async (slug: string, enrollmentId: string, windowStart: string, present: boolean, clear: boolean, reason: string): Promise<AcademicResult<null>> =>
  validIds(enrollmentId) && /^\d{4}-\d{2}-\d{2}$/.test(windowStart)
    ? runRpc(
        slug,
        (token) => participationRpc.adjust({ institutionSlug: slug, enrollmentId, windowStart, present, clear, reason: reason.slice(0, 300) }, { token }),
        () => null,
        clear ? 'Ajuste quitado.' : 'Semana ajustada.',
      )
    : notFound;
