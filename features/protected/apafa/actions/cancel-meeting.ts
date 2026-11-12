'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import { apafaRpc } from '@/lib/api/grpc/apafa';
import type { AcademicResult, CancelPayload, Meeting } from '../types';

// Calls off a meeting still to be held (ApafaService.CancelMeeting)
export const cancelMeetingAction = async (slug: string, p: CancelPayload): Promise<AcademicResult<Meeting>> =>
  validIds(p.id)
    ? runRpc(
        slug,
        (token) => apafaRpc.cancel({ institutionSlug: slug, id: p.id, reason: p.reason, notify: p.notify }, { token }),
        (d) => d.meeting,
        p.notify ? 'Reunión cancelada y familias avisadas.' : 'Reunión cancelada.',
      )
    : notFound;
