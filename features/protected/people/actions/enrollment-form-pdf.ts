'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import type { PdfDownload } from '@/features/protected/documents/actions/document-actions';
import { documentsRpc } from '@/lib/api/grpc/documents';
import type { PdfFile } from '@/lib/api/grpc/gen/joseph/documents/v1/documents';

const toDownload = (f?: PdfFile): PdfDownload | undefined => (f ? { fileName: f.fileName, base64: Buffer.from(f.content).toString('base64') } : undefined);

// The ficha única as PDF, with the enrollment of the period given or the latest (DocumentsService.EnrollmentFormPdf)
export const enrollmentFormPdfAction = async (slug: string, studentId: string, periodId = ''): Promise<AcademicResult<PdfDownload>> =>
  validIds(studentId) && (periodId === '' || validIds(periodId))
    ? runRpc(slug, (token) => documentsRpc.enrollmentForm({ institutionSlug: slug, studentId, periodId }, { token, timeoutMs: 60_000 }), (d) => toDownload(d.file))
    : notFound;
