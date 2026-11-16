'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { peopleRpc } from '@/lib/api/grpc/people';
import type { RollData, RollFilter } from '../types';

// True when every id is empty or a valid UUID
const optional = (...ids: string[]): boolean => ids.every((id) => id === '' || validIds(id));

// The nómina of a period with the SIAGIE state of each enrollment (PeopleService.ListRoll)
export const listRollAction = async (slug: string, filter: RollFilter): Promise<AcademicResult<RollData>> =>
  validIds(filter.periodId) && optional(filter.levelId, filter.gradeId, filter.sectionId) && /^(|pending|exported|observed)$/.test(filter.siagieStatus)
    ? runRpc(slug, (token) => peopleRpc.roll({ institutionSlug: slug, filter }, { token }), (d) => d)
    : notFound;
