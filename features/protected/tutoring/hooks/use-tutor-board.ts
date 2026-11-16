'use client';

import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import type { RemoteState } from '@/features/protected/academic/types';
import type { LiveEvent } from '@/hooks/use-live';
import { isAttendanceEvent, isTutoringEvent, isWellbeingEvent } from '@/hooks/use-live';
import { getTutorBoardAction } from '../actions/get-tutor-board';
import type { TutorBoard } from '../types';

const refreshOn = (type: LiveEvent['type']): boolean => isTutoringEvent(type) || isWellbeingEvent(type) || isAttendanceEvent(type);

// The tutor's board (another tutor's for dirección), refreshed when tutoring, wellbeing or activity changes
export const useTutorBoard = (slug: string, staffId: string): RemoteState<TutorBoard> =>
  useAcademicData(`tutor-board:${slug}:${staffId}`, () => getTutorBoardAction(slug, staffId), refreshOn);
