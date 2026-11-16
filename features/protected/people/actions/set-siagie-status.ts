'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { peopleRpc } from '@/lib/api/grpc/people';

const labels: Record<string, string> = { pending: 'pendientes', exported: 'exportadas', observed: 'observadas' };

// Marks enrollments as pending, exported or observed in the SIAGIE (PeopleService.SetSiagieStatus)
export const setSiagieStatusAction = async (slug: string, enrollmentIds: string[], status: string, note: string): Promise<AcademicResult<number>> =>
  enrollmentIds.length > 0 && enrollmentIds.every((id) => validIds(id)) && status in labels
    ? runRpc(
        slug,
        (token) => peopleRpc.setSiagieStatus({ institutionSlug: slug, enrollmentIds, status, note: note.slice(0, 300) }, { token }),
        (d) => d.updated,
        `Matrículas marcadas como ${labels[status]}.`,
      )
    : notFound;
