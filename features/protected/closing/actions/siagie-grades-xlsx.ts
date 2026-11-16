'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import type { PdfDownload } from '@/features/protected/documents/actions/document-actions';
import { documentsRpc } from '@/lib/api/grpc/documents';

const XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

// The SIAGIE spreadsheet of a section's final levels; with markExported its students become exported
// (DocumentsService.SiagieGradesXlsx)
export const siagieGradesXlsxAction = async (slug: string, sectionId: string, markExported: boolean): Promise<AcademicResult<PdfDownload & { marked: number }>> =>
  validIds(sectionId)
    ? runRpc(
        slug,
        (token) => documentsRpc.siagieGradesXlsx({ institutionSlug: slug, sectionId, markExported }, { token, timeoutMs: 60_000 }),
        (d) => (d.file ? { fileName: d.file.fileName, base64: Buffer.from(d.file.content).toString('base64'), mime: XLSX, marked: d.marked } : undefined),
      )
    : notFound;
