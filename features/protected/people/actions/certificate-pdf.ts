'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import type { PdfDownload } from '@/features/protected/documents/actions/document-actions';
import { documentsRpc } from '@/lib/api/grpc/documents';

// The newest version of a constancia, with its seal (DocumentsService.CertificatePdf)
export const certificatePdfAction = async (slug: string, certificateId: string): Promise<AcademicResult<PdfDownload>> =>
  validIds(certificateId)
    ? runRpc(slug, (token) => documentsRpc.certificatePdf({ institutionSlug: slug, certificateId }, { token, timeoutMs: 60_000 }), (d) =>
        d.file ? { fileName: d.file.fileName, base64: Buffer.from(d.file.content).toString('base64') } : undefined,
      )
    : notFound;
