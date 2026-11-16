'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import { institutionRpc } from '@/lib/api/grpc/institution';
import type { AcademicResult, Authorization, AuthorizationPayload } from '../types';

// Records (empty id) or edits one authorizing resolution (InstitutionService.SaveAuthorization)
export const saveAuthorizationAction = async (slug: string, p: AuthorizationPayload): Promise<AcademicResult<Authorization>> =>
  (p.id && !validIds(p.id)) || (p.levelId && !validIds(p.levelId))
    ? notFound
    : runRpc(
        slug,
        (token) =>
          institutionRpc.saveAuthorization(
            {
              institutionSlug: slug,
              authorization: {
                id: p.id,
                kind: p.kind,
                levelId: p.levelId,
                levelName: '',
                attentionMode: p.attentionMode,
                resolution: p.resolution,
                issuedBy: p.issuedBy,
                issuedOn: p.issuedOn,
                expiresOn: p.expiresOn,
                fileNumber: p.fileNumber,
                notes: p.notes,
                inForce: false,
                files: 0,
              },
            },
            { token },
          ),
        (d) => d.authorization,
        p.id ? 'Autorización actualizada.' : 'Autorización registrada.',
      );
