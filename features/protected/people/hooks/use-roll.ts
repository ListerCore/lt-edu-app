'use client';

import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import type { RemoteState } from '@/features/protected/academic/types';
import { isPeopleEvent } from '@/hooks/use-live';
import { listRollAction } from '../actions/list-roll';
import type { RollData, RollFilter } from '../types';

// The nómina of a period with its SIAGIE states; refetches when enrollment changes (live)
export const useRoll = (slug: string, filter: RollFilter): RemoteState<RollData> => useAcademicData(`roll:${slug}:${JSON.stringify(filter)}`, () => listRollAction(slug, filter), isPeopleEvent);
