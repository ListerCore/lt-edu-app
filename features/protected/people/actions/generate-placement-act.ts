'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { documentsRpc } from '@/lib/api/grpc/documents';

// Freezes the acta of a placement as a version for its signers (DocumentsService.GeneratePlacementAct)
export const generatePlacementActAction = async (slug: string, placementId: string, note: string): Promise<AcademicResult<string>> =>
  validIds(placementId)
    ? runRpc(slug, (token) => documentsRpc.generatePlacementAct({ institutionSlug: slug, placementId, note: note.slice(0, 300) }, { token, timeoutMs: 60_000 }), (d) => d.actCode, 'Acta generada: falta la firma.')
    : notFound;
