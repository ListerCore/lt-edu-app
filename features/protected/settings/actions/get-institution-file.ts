'use server';

import { runRpc } from '@/features/protected/academic/lib/run-rpc';
import { institutionRpc } from '@/lib/api/grpc/institution';
import type { AcademicResult, InstitutionFileData } from '../types';

// Authorizations and platform sheet of the institution (InstitutionService.GetInstitutionFile)
export const getInstitutionFileAction = async (slug: string): Promise<AcademicResult<InstitutionFileData>> =>
  runRpc(
    slug,
    (token) => institutionRpc.file({ institutionSlug: slug }, { token }),
    (d) =>
      d.platform
        ? {
            institutionId: d.institutionId,
            institutionName: d.institutionName,
            institutionKind: d.institutionKind,
            authorizations: d.authorizations,
            platform: d.platform,
            canManageAuthorizations: d.canManageAuthorizations,
            canEditPlatform: d.canEditPlatform,
          }
        : undefined,
  );
