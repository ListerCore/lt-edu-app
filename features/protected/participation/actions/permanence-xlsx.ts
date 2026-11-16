'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import type { PdfDownload } from '@/features/protected/documents/actions/document-actions';
import { documentsRpc } from '@/lib/api/grpc/documents';

const XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

// The permanence of a distance section week by week as Excel (DocumentsService.PermanenceXlsx)
export const permanenceXlsxAction = async (slug: string, sectionId: string): Promise<AcademicResult<PdfDownload>> =>
  validIds(sectionId)
    ? runRpc(
        slug,
        (token) => documentsRpc.permanenceXlsx({ institutionSlug: slug, sectionId }, { token, timeoutMs: 60_000 }),
        (d): PdfDownload | undefined => (d.file ? { fileName: d.file.fileName, base64: Buffer.from(d.file.content).toString('base64'), mime: XLSX } : undefined),
      )
    : notFound;
