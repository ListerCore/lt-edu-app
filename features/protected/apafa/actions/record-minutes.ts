'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import { apafaRpc } from '@/lib/api/grpc/apafa';
import type { AcademicResult, Meeting, MinutesPayload } from '../types';

// Marks the meeting held and stores the acta; publish tells the families (ApafaService.RecordMinutes)
export const recordMinutesAction = async (slug: string, p: MinutesPayload): Promise<AcademicResult<Meeting>> =>
  validIds(p.id)
    ? runRpc(
        slug,
        (token) => apafaRpc.recordMinutes({ institutionSlug: slug, id: p.id, minutes: p.minutes, agreements: p.agreements, attendees: p.attendees, publish: p.publish }, { token }),
        (d) => d.meeting,
        p.publish ? 'Acta registrada y publicada a las familias.' : 'Acta registrada.',
      )
    : notFound;
