'use server';

import { runRpc } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { academicRpc } from '@/lib/api/grpc/academic';
import type { Management } from '../types';

// Management type (public | private) of the institution the session works on; every role may read it, families too.
// Anything the API does not know as "public" is treated as private, the database default
export const getInstitutionManagementAction = async (slug: string): Promise<AcademicResult<Management>> =>
  runRpc(
    slug,
    (token) => academicRpc.getManagement({ institutionSlug: slug }, { token }),
    (data): Management => (data.management === 'public' ? 'public' : 'private'),
  );
