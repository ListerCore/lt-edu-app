'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { complianceRpc } from '@/lib/api/grpc/compliance';

// Removes an environment; its devices stay without a place (ComplianceService.DeleteRoom)
export const deleteRoomAction = async (slug: string, id: string): Promise<AcademicResult<true>> =>
  validIds(id) ? runRpc(slug, (token) => complianceRpc.deleteRoom({ institutionSlug: slug, id }, { token }), () => true as const, 'Ambiente eliminado.') : notFound;
