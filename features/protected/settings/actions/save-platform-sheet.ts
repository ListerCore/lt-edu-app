'use server';

import { runRpc } from '@/features/protected/academic/lib/run-rpc';
import { institutionRpc } from '@/lib/api/grpc/institution';
import type { AcademicResult, PlatformSheet, PlatformSheetValues } from '../types';

// Saves the technical sheet of the e-learning platform (InstitutionService.SavePlatformSheet)
export const savePlatformSheetAction = async (slug: string, p: PlatformSheetValues): Promise<AcademicResult<PlatformSheet>> =>
  runRpc(
    slug,
    (token) => institutionRpc.savePlatformSheet({ institutionSlug: slug, platform: { ...p, updatedByName: '', updatedAt: '', files: 0 } }, { token }),
    (d) => d.platform,
    'Ficha de la plataforma guardada.',
  );
