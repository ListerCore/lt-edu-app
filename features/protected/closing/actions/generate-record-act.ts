'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { documentsRpc } from '@/lib/api/grpc/documents';

// Freezes an issued acta as a version for its signers (DocumentsService.GenerateRecordAct)
export const generateRecordActAction = async (slug: string, recordId: string, note: string): Promise<AcademicResult<string>> =>
  validIds(recordId)
    ? runRpc(slug, (token) => documentsRpc.generateRecordAct({ institutionSlug: slug, recordId, note: note.slice(0, 300) }, { token, timeoutMs: 60_000 }), (d) => d.version?.id ?? '', 'Acta lista para firmar.')
    : notFound;
