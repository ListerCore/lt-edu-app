'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import { apafaRpc } from '@/lib/api/grpc/apafa';
import type { AcademicResult } from '../types';

// Removes one office of the APAFA board (ApafaService.DeleteBoardMember)
export const deleteBoardMemberAction = async (slug: string, id: string): Promise<AcademicResult<null>> =>
  validIds(id)
    ? runRpc(
        slug,
        (token) => apafaRpc.deleteBoardMember({ institutionSlug: slug, id }, { token }),
        () => null,
        'Cargo eliminado.',
      )
    : notFound;
