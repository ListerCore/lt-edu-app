'use server';

import { runRpc } from '@/features/protected/academic/lib/run-rpc';
import { institutionRpc } from '@/lib/api/grpc/institution';
import type { AcademicResult, ModulesData } from '../types';

// Optional modules of the institution and whether this user may switch them (InstitutionService.ListModules)
export const getModulesAction = async (slug: string): Promise<AcademicResult<ModulesData>> =>
  runRpc(
    slug,
    (token) => institutionRpc.modules({ institutionSlug: slug }, { token }),
    (d) => ({ modules: d.modules.map((m) => ({ key: m.key, name: m.name, enabled: m.enabled })), canManage: d.canManage }),
  );
