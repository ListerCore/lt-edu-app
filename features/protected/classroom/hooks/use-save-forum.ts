'use client';

import { runAcademicAction } from '@/features/protected/academic/hooks/use-academic-form';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { saveForumAction } from '../actions/save-forum';

// Changes the kind of forum or opens and closes it
export const useSaveForum = (itemId: string, onSaved: () => void): ((kind: string, closed: boolean) => Promise<void>) => {
  const slug = useInstitutionSlug();
  return async (kind: string, closed: boolean): Promise<void> => {
    const r = await runAcademicAction(saveForumAction(slug, itemId, kind, closed), closed ? 'Foro cerrado.' : 'Foro guardado.');
    if (r.ok) onSaved();
  };
};
