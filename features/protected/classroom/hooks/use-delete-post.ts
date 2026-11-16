'use client';

import { runAcademicAction } from '@/features/protected/academic/hooks/use-academic-form';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { deletePostAction } from '../actions/delete-post';

// Removes one's own post while nobody replied
export const useDeletePost = (onDeleted: () => void): ((postId: string) => Promise<void>) => {
  const slug = useInstitutionSlug();
  return async (postId: string): Promise<void> => {
    const r = await runAcademicAction(deletePostAction(slug, postId));
    if (r.ok) onDeleted();
  };
};
