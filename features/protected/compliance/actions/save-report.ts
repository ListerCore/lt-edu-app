'use server';

import { notFound, runRpc } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { complianceRpc } from '@/lib/api/grpc/compliance';
import type { Report } from '../types';

// The data and conclusions of a report (ComplianceService.SaveReport)
export const saveReportAction = async (slug: string, report: Report): Promise<AcademicResult<Report>> =>
  report.kind === 'platform' || report.kind === 'equipment' ? runRpc(slug, (token) => complianceRpc.saveReport({ institutionSlug: slug, report }, { token }), (d) => d.report, 'Datos del informe guardados.') : notFound;
