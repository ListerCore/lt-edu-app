'use client';

import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import type { RemoteState } from '@/features/protected/academic/types';
import { isTutoringEvent } from '@/hooks/use-live';
import { getMyTutoringAction } from '../actions/get-my-tutoring';
import type { MyTutoring } from '../types';

export const useMyTutoring = (slug: string): RemoteState<MyTutoring> => useAcademicData(`my-tutoring:${slug}`, () => getMyTutoringAction(slug), isTutoringEvent);
