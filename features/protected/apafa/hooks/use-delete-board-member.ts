'use client';

import { useState } from 'react';
import { runAcademicAction } from '@/features/protected/academic/hooks/use-academic-form';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { deleteBoardMemberAction } from '../actions/delete-board-member';
import type { UseDeleteBoardMemberResult } from '../types';

// Removes one office of the board, then reloads the list (the live event refreshes other open pages)
export const useDeleteBoardMember = (onDeleted: () => void): UseDeleteBoardMemberResult => {
  const slug = useInstitutionSlug();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const remove = (id: string): void => {
    setDeletingId(id);
    void runAcademicAction(deleteBoardMemberAction(slug, id))
      .then((result): void => {
        if (result.ok) onDeleted();
      })
      .finally((): void => setDeletingId(null));
  };
  return { remove, deletingId };
};
