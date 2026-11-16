'use client';

import { runAcademicAction } from '@/features/protected/academic/hooks/use-academic-form';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { editPostAction } from '../actions/edit-post';

// Changes the text of one's own post; resolves true when saved
export const useEditPost = (onEdited: () => void): ((postId: string, body: string) => Promise<boolean>) => {
  const slug = useInstitutionSlug();
  return async (postId: string, body: string): Promise<boolean> => {
    const text = body.trim();
    if (!text) return false;
    const r = await runAcademicAction(editPostAction(slug, postId, text.slice(0, 5000)));
    if (r.ok) onEdited();
    return r.ok;
  };
};
