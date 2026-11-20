'use client';

import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import type { RemoteState } from '@/features/protected/academic/types';
import { joinSessionAction } from '../actions/join-session';
import type { JoinInfo } from '../types';

// Enters the session once per visit (each entry is logged as attendance); reload() tries again
export const useJoinSession = (slug: string, source: string, id: string): RemoteState<JoinInfo> =>
  useAcademicData(
    `live-join:${slug}:${source}:${id}`,
    () => joinSessionAction(slug, source, id),
    () => false,
  );
