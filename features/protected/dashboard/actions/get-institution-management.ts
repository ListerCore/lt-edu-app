'use server';

import { runRpc } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { academicRpc } from '@/lib/api/grpc/academic';
import type { InstitutionManagement, ModuleKey } from '../types';

// Management type (public | private) and the optional modules turned off, of the institution the session works on;
// every role may read it, families too. Anything the API does not know as "public" is treated as private
export const getInstitutionManagementAction = async (slug: string): Promise<AcademicResult<InstitutionManagement>> =>
  runRpc(
    slug,
    (token) => academicRpc.getManagement({ institutionSlug: slug }, { token }),
    (data): InstitutionManagement => ({ management: data.management === 'public' ? 'public' : 'private', disabledModules: data.disabledModules as ModuleKey[] }),
  );
