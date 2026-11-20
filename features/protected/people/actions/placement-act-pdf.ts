'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import type { PdfDownload } from '@/features/protected/documents/actions/document-actions';
import { documentsRpc } from '@/lib/api/grpc/documents';
import type { PdfFile } from '@/lib/api/grpc/gen/ltedu/documents/v1/documents';

const toDownload = (f?: PdfFile): PdfDownload | undefined => (f ? { fileName: f.fileName, base64: Buffer.from(f.content).toString('base64') } : undefined);

// The newest version of a placement's acta, with its seal (DocumentsService.PlacementActPdf)
export const placementActPdfAction = async (slug: string, placementId: string): Promise<AcademicResult<PdfDownload>> =>
  validIds(placementId)
    ? runRpc(slug, (token) => documentsRpc.placementActPdf({ institutionSlug: slug, placementId }, { token, timeoutMs: 60_000 }), (d) => toDownload(d.file))
    : notFound;
