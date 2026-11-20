'use client';

import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import type { RemoteState } from '@/features/protected/academic/types';
import { isClassroomEvent, isTutoringEvent, type LiveEvent } from '@/hooks/use-live';
import { getAgendaAction } from '../actions/get-agenda';
import type { LiveAgenda } from '../types';

const refreshOn = (type: LiveEvent['type']): boolean => isClassroomEvent(type) || isTutoringEvent(type);

// The person's live classes, tutoring and psychology appointments; refreshed when the classroom or tutoring change
export const useLiveAgenda = (slug: string): RemoteState<LiveAgenda> => useAcademicData(`live-agenda:${slug}`, () => getAgendaAction(slug), refreshOn);
