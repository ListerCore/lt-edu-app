'use client';

import { useState } from 'react';
import { runAcademicAction } from '@/features/protected/academic/hooks/use-academic-form';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { deleteLibraryItemAction } from '../actions/delete-library-item';
import type { UseDeleteResult } from '../types';

// Removes a library entry no room uses and without files
export const useDeleteLibraryItem = (onDeleted: () => void): UseDeleteResult => {
  const slug = useInstitutionSlug();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const remove = (id: string): void => {
    setDeletingId(id);
    void runAcademicAction(deleteLibraryItemAction(slug, id))
      .then((result): void => {
        if (result.ok) onDeleted();
      })
      .finally((): void => setDeletingId(null));
  };
  return { remove, deletingId };
};
