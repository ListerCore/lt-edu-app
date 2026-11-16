'use client';

import { useState } from 'react';
import { runAcademicAction } from '@/features/protected/academic/hooks/use-academic-form';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { deleteItemAction } from '../actions/delete-item';
import type { UseDeleteResult } from '../types';

// Removes a piece of material (the API refuses while it has files of its own), then reloads the room
export const useDeleteItem = (onDeleted: () => void): UseDeleteResult => {
  const slug = useInstitutionSlug();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const remove = (id: string): void => {
    setDeletingId(id);
    void runAcademicAction(deleteItemAction(slug, id))
      .then((result): void => {
        if (result.ok) onDeleted();
      })
      .finally((): void => setDeletingId(null));
  };
  return { remove, deletingId };
};
