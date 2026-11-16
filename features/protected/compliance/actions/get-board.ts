'use server';

import { runRpc } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { complianceRpc } from '@/lib/api/grpc/compliance';
import type { ComplianceBoard } from '../types';

// The compliance file: platform, reports, matrices, equipment, checks and uptime (ComplianceService.GetBoard)
export const getBoardAction = async (slug: string): Promise<AcademicResult<ComplianceBoard>> => runRpc(slug, (token) => complianceRpc.board({ institutionSlug: slug }, { token }), (d) => d);
