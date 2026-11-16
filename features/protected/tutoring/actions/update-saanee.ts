'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { tutoringRpc } from '@/lib/api/grpc/tutoring';
import type { SaaneeReferral } from '../types';

// Follows a SAANEE referral up (TutoringService.UpdateSaanee)
export const updateSaaneeAction = async (slug: string, r: { id: string; status: string; reference: string; response: string }): Promise<AcademicResult<SaaneeReferral>> =>
  validIds(r.id)
    ? runRpc(slug, (token) => tutoringRpc.updateSaanee({ institutionSlug: slug, ...r, reference: r.reference.slice(0, 120), response: r.response.slice(0, 2000) }, { token }), (d) => d.referral, 'Derivación actualizada.')
    : notFound;
