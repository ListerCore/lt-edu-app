'use server';

import { runRpc } from '@/features/protected/academic/lib/run-rpc';
import { institutionRpc } from '@/lib/api/grpc/institution';
import type { AcademicResult, GrantMemberValues } from '../types';

// Gives a staff role to an email; pending=true when it left an invitation (InstitutionService.GrantMember)
export const grantMemberAction = async (slug: string, p: GrantMemberValues): Promise<AcademicResult<{ pending: boolean }>> =>
  runRpc(slug, (token) => institutionRpc.grantMember({ institutionSlug: slug, email: p.email, role: p.role }, { token }), (d) => ({ pending: d.pending }));
