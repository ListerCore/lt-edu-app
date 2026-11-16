'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { peopleRpc } from '@/lib/api/grpc/people';
import type { ImportRollResponse, ImportRow } from '@/lib/api/grpc/gen/joseph/people/v1/people';

// Checks (commit false) or imports (commit true) the roll of a period from the rows of a spreadsheet (PeopleService.ImportRoll)
export const importRollAction = async (slug: string, periodId: string, rows: ImportRow[], commit: boolean): Promise<AcademicResult<ImportRollResponse>> =>
  validIds(periodId) && rows.length > 0 && rows.length <= 2000
    ? runRpc(slug, (token) => peopleRpc.importRoll({ institutionSlug: slug, periodId, rows, commit }, { token, timeoutMs: 120_000 }), (d) => d, commit ? 'Nómina importada.' : undefined)
    : notFound;
