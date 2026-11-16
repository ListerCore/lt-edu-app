'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import { institutionRpc } from '@/lib/api/grpc/institution';
import type { AcademicResult } from '../types';

// Takes a staff role away, or cancels the invitation (InstitutionService.RevokeMember)
export const revokeMemberAction = async (slug: string, id: string): Promise<AcademicResult<null>> =>
  validIds(id) ? runRpc(slug, (token) => institutionRpc.revokeMember({ institutionSlug: slug, id }, { token }), () => null, 'Acceso retirado.') : notFound;
