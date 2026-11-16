'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import type { PdfDownload } from '@/features/protected/documents/actions/document-actions';
import { documentsRpc } from '@/lib/api/grpc/documents';
import type { RollFilter } from '../types';

const XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const optional = (...ids: string[]): boolean => ids.every((id) => id === '' || validIds(id));

// The nómina as an Excel workbook (DocumentsService.RollXlsx)
export const rollXlsxAction = async (slug: string, filter: RollFilter): Promise<AcademicResult<PdfDownload>> =>
  validIds(filter.periodId) && optional(filter.levelId, filter.gradeId, filter.sectionId)
    ? runRpc(
        slug,
        (token) => documentsRpc.rollXlsx({ institutionSlug: slug, filter }, { token, timeoutMs: 60_000 }),
        (d): PdfDownload | undefined => (d.file ? { fileName: d.file.fileName, base64: Buffer.from(d.file.content).toString('base64'), mime: XLSX } : undefined),
      )
    : notFound;
