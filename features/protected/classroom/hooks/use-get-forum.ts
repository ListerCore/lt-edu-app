'use client';

import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { isClassroomEvent } from '@/hooks/use-live';
import { getForumAction } from '../actions/get-forum';
import type { ForumData, RemoteState } from '../types';

// A forum; refetches when anyone writes or moderates (live), so new posts show up without reloading
export const useGetForum = (itemId: string): RemoteState<ForumData> => {
  const slug = useInstitutionSlug();
  return useAcademicData(`classroom-forum:${slug}:${itemId}`, () => getForumAction(slug, itemId), isClassroomEvent);
};
