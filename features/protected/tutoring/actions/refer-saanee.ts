'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { tutoringRpc } from '@/lib/api/grpc/tutoring';
import type { SaaneeReferral } from '../types';

// Refers a student to the SAANEE (TutoringService.ReferSaanee)
export const referSaaneeAction = async (slug: string, r: { studentId: string; reason: string; reference: string; sentOn: string }): Promise<AcademicResult<SaaneeReferral>> =>
  validIds(r.studentId)
    ? runRpc(slug, (token) => tutoringRpc.referSaanee({ institutionSlug: slug, ...r, reason: r.reason.slice(0, 2000), reference: r.reference.slice(0, 120) }, { token }), (d) => d.referral, 'Derivación al SAANEE registrada.')
    : notFound;
