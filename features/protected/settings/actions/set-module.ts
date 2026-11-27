'use server';

import { runRpc } from '@/features/protected/academic/lib/run-rpc';
import { institutionRpc } from '@/lib/api/grpc/institution';
import type { AcademicResult } from '../types';

// Turns an optional module on or off for the whole institution (InstitutionService.SetModule)
export const setModuleAction = async (slug: string, key: string, enabled: boolean): Promise<AcademicResult<null>> =>
  runRpc(
    slug,
    (token) => institutionRpc.setModule({ institutionSlug: slug, key, enabled }, { token }),
    () => null,
    enabled ? 'Módulo activado.' : 'Módulo desactivado.',
  );
