'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import { apafaRpc } from '@/lib/api/grpc/apafa';
import type { AcademicResult, MeetingDetail } from '../types';

// One meeting and whether the person may change it (ApafaService.GetMeeting)
export const getMeetingAction = async (slug: string, id: string): Promise<AcademicResult<MeetingDetail>> =>
  validIds(id)
    ? runRpc(
        slug,
        (token) => apafaRpc.meeting({ institutionSlug: slug, id }, { token }),
        (d) => (d.meeting ? { meeting: d.meeting, canManage: d.canManage } : undefined),
      )
    : notFound;
