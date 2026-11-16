'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { complianceRpc } from '@/lib/api/grpc/compliance';

export const deleteCheckAction = async (slug: string, id: string): Promise<AcademicResult<true>> =>
  validIds(id) ? runRpc(slug, (token) => complianceRpc.deleteCheck({ institutionSlug: slug, id }, { token }), () => true as const, 'Prueba eliminada.') : notFound;
