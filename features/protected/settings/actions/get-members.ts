'use server';

import { runRpc } from '@/features/protected/academic/lib/run-rpc';
import { institutionRpc } from '@/lib/api/grpc/institution';
import type { AcademicResult, MembersData } from '../types';

// Staff accesses of the institution and the roles that can be given (InstitutionService.ListMembers)
export const getMembersAction = async (slug: string): Promise<AcademicResult<MembersData>> =>
  runRpc(
    slug,
    (token) => institutionRpc.members({ institutionSlug: slug }, { token }),
    (d) => ({ members: d.members, grantableRoles: d.grantableRoles, selfUserId: d.selfUserId }),
  );
