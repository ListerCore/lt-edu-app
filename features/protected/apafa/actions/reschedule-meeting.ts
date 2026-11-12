'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import { apafaRpc } from '@/lib/api/grpc/apafa';
import type { AcademicResult, Meeting, ReschedulePayload } from '../types';

// Moves a meeting to a new date with its reason (ApafaService.RescheduleMeeting)
export const rescheduleMeetingAction = async (slug: string, p: ReschedulePayload): Promise<AcademicResult<Meeting>> =>
  validIds(p.id)
    ? runRpc(
        slug,
        (token) => apafaRpc.reschedule({ institutionSlug: slug, id: p.id, scheduledAt: p.scheduledAt, reason: p.reason, notify: p.notify }, { token }),
        (d) => d.meeting,
        p.notify ? 'Reunión reprogramada y familias avisadas.' : 'Reunión reprogramada.',
      )
    : notFound;
