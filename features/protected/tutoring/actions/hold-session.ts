'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { tutoringRpc } from '@/lib/api/grpc/tutoring';
import type { HoldInput, TutoringSession } from '../types';

// Records a session: who came, notes, agreements and a commitment (TutoringService.HoldTutoringSession)
export const holdSessionAction = async (slug: string, h: HoldInput): Promise<AcademicResult<TutoringSession>> =>
  validIds(h.id) && (h.attended.length === 0 || validIds(...h.attended))
    ? runRpc(
        slug,
        (token) =>
          tutoringRpc.holdSession(
            { institutionSlug: slug, ...h, notes: h.notes.slice(0, 4000), agreements: h.agreements.slice(0, 2000), commitment: h.commitment.slice(0, 500) },
            { token },
          ),
        (d) => d.session,
        h.attended.length > 0 ? 'Tutoría registrada.' : 'Registrada como no asistió.',
      )
    : notFound;
