'use server';

import { runRpc } from '@/features/protected/academic/lib/run-rpc';
import { apafaRpc } from '@/lib/api/grpc/apafa';
import type { AcademicResult, ApafaData } from '../types';

// Meetings, board and APAFA fee collection of the institution (ApafaService.GetApafa)
export const getApafaAction = async (slug: string): Promise<AcademicResult<ApafaData>> =>
  runRpc(
    slug,
    (token) => apafaRpc.overview({ institutionSlug: slug }, { token }),
    (d) => ({ meetings: d.meetings, board: d.board, fees: d.fees ?? null, canManage: d.canManage }),
  );
