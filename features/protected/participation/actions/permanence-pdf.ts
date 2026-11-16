'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import type { PdfDownload } from '@/features/protected/documents/actions/document-actions';
import { documentsRpc } from '@/lib/api/grpc/documents';

// The permanence report of a distance section as PDF (DocumentsService.PermanencePdf)
export const permanencePdfAction = async (slug: string, sectionId: string): Promise<AcademicResult<PdfDownload>> =>
  validIds(sectionId)
    ? runRpc(
        slug,
        (token) => documentsRpc.permanencePdf({ institutionSlug: slug, sectionId }, { token, timeoutMs: 60_000 }),
        (d): PdfDownload | undefined => (d.file ? { fileName: d.file.fileName, base64: Buffer.from(d.file.content).toString('base64') } : undefined),
      )
    : notFound;
