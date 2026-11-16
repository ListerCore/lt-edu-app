'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import type { PdfDownload } from '@/features/protected/documents/actions/document-actions';
import { documentsRpc } from '@/lib/api/grpc/documents';
import type { PdfFile } from '@/lib/api/grpc/gen/joseph/documents/v1/documents';
import type { RollFilter } from '../types';

const toDownload = (f?: PdfFile): PdfDownload | undefined => (f ? { fileName: f.fileName, base64: Buffer.from(f.content).toString('base64') } : undefined);
const optional = (...ids: string[]): boolean => ids.every((id) => id === '' || validIds(id));

// The nómina de matrícula as PDF, one block per section (DocumentsService.RollPdf)
export const rollPdfAction = async (slug: string, filter: RollFilter): Promise<AcademicResult<PdfDownload>> =>
  validIds(filter.periodId) && optional(filter.levelId, filter.gradeId, filter.sectionId)
    ? runRpc(slug, (token) => documentsRpc.rollPdf({ institutionSlug: slug, filter }, { token, timeoutMs: 60_000 }), (d) => toDownload(d.file))
    : notFound;
