'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import type { PdfDownload } from '@/features/protected/documents/actions/document-actions';
import { documentsRpc } from '@/lib/api/grpc/documents';

// The newest signed version of an acta, with its seal (DocumentsService.RecordActPdf)
export const recordActPdfAction = async (slug: string, recordId: string): Promise<AcademicResult<PdfDownload>> =>
  validIds(recordId)
    ? runRpc(slug, (token) => documentsRpc.recordActPdf({ institutionSlug: slug, recordId }, { token, timeoutMs: 60_000 }), (d) =>
        d.file ? { fileName: d.file.fileName, base64: Buffer.from(d.file.content).toString('base64') } : undefined,
      )
    : notFound;
