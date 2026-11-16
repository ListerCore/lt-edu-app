'use client';

import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import type { RemoteState } from '@/features/protected/academic/types';
import { isTutoringEvent } from '@/hooks/use-live';
import { getTutorAssignmentsAction } from '../actions/get-tutor-assignments';
import type { TutorAssignments } from '../types';

export const useTutorAssignments = (slug: string): RemoteState<TutorAssignments> =>
  useAcademicData(`tutor-assignments:${slug}`, () => getTutorAssignmentsAction(slug), isTutoringEvent);
