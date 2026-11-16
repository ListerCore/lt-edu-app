'use server';

import { notFound, runRpc } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { complianceRpc } from '@/lib/api/grpc/compliance';
import type { UptimeCheck } from '../types';

// Probes the platform URL now (ComplianceService.CheckUptime)
export const checkUptimeAction = async (slug: string): Promise<AcademicResult<UptimeCheck>> =>
  slug === '' ? notFound : runRpc(slug, (token) => complianceRpc.checkUptime({ institutionSlug: slug }, { token, timeoutMs: 20_000 }), (d) => d.check);
