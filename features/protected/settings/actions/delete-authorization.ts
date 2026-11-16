'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import { institutionRpc } from '@/lib/api/grpc/institution';
import type { AcademicResult } from '../types';

// Removes one authorization without files (InstitutionService.DeleteAuthorization)
export const deleteAuthorizationAction = async (slug: string, id: string): Promise<AcademicResult<null>> =>
  validIds(id) ? runRpc(slug, (token) => institutionRpc.deleteAuthorization({ institutionSlug: slug, id }, { token }), () => null, 'Autorización eliminada.') : notFound;
