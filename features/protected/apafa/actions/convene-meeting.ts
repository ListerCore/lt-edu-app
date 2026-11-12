'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import { apafaRpc } from '@/lib/api/grpc/apafa';
import type { AcademicResult, Meeting } from '../types';

// Sends the convocatoria of a meeting saved as draft (ApafaService.ConveneMeeting)
export const conveneMeetingAction = async (slug: string, id: string): Promise<AcademicResult<Meeting>> =>
  validIds(id)
    ? runRpc(
        slug,
        (token) => apafaRpc.convene({ institutionSlug: slug, id }, { token }),
        (d) => d.meeting,
        'Reunión convocada: las familias ya tienen el aviso.',
      )
    : notFound;
