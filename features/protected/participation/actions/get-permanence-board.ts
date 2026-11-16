'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import { participationRpc } from '@/lib/api/grpc/participation';
import type { AcademicResult, PermanenceBoard } from '../types';

// The rule and the distance sections of a period (the one in course when empty) (ParticipationService.GetPermanenceBoard)
export const getPermanenceBoardAction = async (slug: string, periodId = ''): Promise<AcademicResult<PermanenceBoard>> =>
  periodId === '' || validIds(periodId) ? runRpc(slug, (token) => participationRpc.board({ institutionSlug: slug, periodId }, { token }), (d) => d) : notFound;
