'use client';

import { useState } from 'react';
import { runAcademicAction } from '@/features/protected/academic/hooks/use-academic-form';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { deleteUnitAction } from '../actions/delete-unit';
import type { UseDeleteResult } from '../types';

// Removes an empty unit, then reloads the room
export const useDeleteUnit = (onDeleted: () => void): UseDeleteResult => {
  const slug = useInstitutionSlug();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const remove = (id: string): void => {
    setDeletingId(id);
    void runAcademicAction(deleteUnitAction(slug, id))
      .then((result): void => {
        if (result.ok) onDeleted();
      })
      .finally((): void => setDeletingId(null));
  };
  return { remove, deletingId };
};
