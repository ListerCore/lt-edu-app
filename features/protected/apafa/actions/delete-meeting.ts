'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import { apafaRpc } from '@/lib/api/grpc/apafa';
import type { AcademicResult } from '../types';

// Deletes a draft meeting (never convened, without files) (ApafaService.DeleteMeeting)
export const deleteMeetingAction = async (slug: string, id: string): Promise<AcademicResult<null>> =>
  validIds(id)
    ? runRpc(
        slug,
        (token) => apafaRpc.deleteMeeting({ institutionSlug: slug, id }, { token }),
        () => null,
        'Reunión eliminada.',
      )
    : notFound;
