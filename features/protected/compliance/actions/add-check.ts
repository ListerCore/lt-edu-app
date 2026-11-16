'use server';

import { runRpc } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { complianceRpc } from '@/lib/api/grpc/compliance';
import type { Check } from '../types';

// Records a connectivity or platform-access test (ComplianceService.AddCheck)
export const addCheckAction = async (slug: string, check: Check): Promise<AcademicResult<Check>> =>
  runRpc(slug, (token) => complianceRpc.addCheck({ institutionSlug: slug, check }, { token }), (d) => d.check, 'Prueba registrada.');
