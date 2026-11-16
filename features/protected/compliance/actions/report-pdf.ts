'use server';

import { notFound, runRpc } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { complianceRpc } from '@/lib/api/grpc/compliance';
import type { PdfDownload } from '@/features/protected/documents/actions/document-actions';

// One of the two technical reports in PDF (ComplianceService.PlatformReportPdf / EquipmentReportPdf)
export const reportPdfAction = async (slug: string, kind: 'platform' | 'equipment'): Promise<AcademicResult<PdfDownload>> =>
  slug === ''
    ? notFound
    : kind === 'platform'
      ? runRpc(slug, (token) => complianceRpc.platformPdf({ institutionSlug: slug }, { token, timeoutMs: 90_000 }), (d) => (d.file ? { fileName: d.file.fileName, base64: Buffer.from(d.file.content).toString('base64') } : undefined))
      : runRpc(slug, (token) => complianceRpc.equipmentPdf({ institutionSlug: slug }, { token, timeoutMs: 90_000 }), (d) => (d.file ? { fileName: d.file.fileName, base64: Buffer.from(d.file.content).toString('base64') } : undefined));
