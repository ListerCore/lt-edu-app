'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { complianceRpc } from '@/lib/api/grpc/compliance';

// Removes a device and its tests (ComplianceService.DeleteDevice)
export const deleteDeviceAction = async (slug: string, id: string): Promise<AcademicResult<true>> =>
  validIds(id) ? runRpc(slug, (token) => complianceRpc.deleteDevice({ institutionSlug: slug, id }, { token }), () => true as const, 'Equipo eliminado.') : notFound;
