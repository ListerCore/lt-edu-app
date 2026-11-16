'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { peopleRpc } from '@/lib/api/grpc/people';

// Grants or withdraws the exemption from Educación Religiosa of an enrollment (PeopleService.SetReligionExemption)
export const setReligionExemptionAction = async (slug: string, enrollmentId: string, exempt: boolean, requestedOn: string, reference: string): Promise<AcademicResult<null>> =>
  validIds(enrollmentId) && (requestedOn === '' || /^\d{4}-\d{2}-\d{2}$/.test(requestedOn))
    ? runRpc(
        slug,
        (token) => peopleRpc.setReligionExemption({ institutionSlug: slug, enrollmentId, exempt, requestedOn, reference: reference.slice(0, 120) }, { token }),
        () => null,
        exempt ? 'Exoneración registrada.' : 'Exoneración retirada.',
      )
    : notFound;
