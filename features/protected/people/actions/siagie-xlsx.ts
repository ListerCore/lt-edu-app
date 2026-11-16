'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import type { PdfDownload } from '@/features/protected/documents/actions/document-actions';
import { documentsRpc } from '@/lib/api/grpc/documents';
import type { RollFilter } from '../types';

const XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const optional = (...ids: string[]): boolean => ids.every((id) => id === '' || validIds(id));

// The SIAGIE upload spreadsheet; with markExported its enrollments become exported (DocumentsService.SiagieXlsx)
export const siagieXlsxAction = async (slug: string, filter: RollFilter, markExported: boolean): Promise<AcademicResult<PdfDownload & { marked: number }>> =>
  validIds(filter.periodId) && optional(filter.levelId, filter.gradeId, filter.sectionId)
    ? runRpc(
        slug,
        (token) => documentsRpc.siagieXlsx({ institutionSlug: slug, filter, markExported }, { token, timeoutMs: 60_000 }),
        (d) => (d.file ? { fileName: d.file.fileName, base64: Buffer.from(d.file.content).toString('base64'), mime: XLSX, marked: d.marked } : undefined),
      )
    : notFound;
