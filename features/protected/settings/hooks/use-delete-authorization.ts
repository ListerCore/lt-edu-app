'use client';

import { useState } from 'react';
import { runAcademicAction } from '@/features/protected/academic/hooks/use-academic-form';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { deleteAuthorizationAction } from '../actions/delete-authorization';
import type { UseDeleteAuthorizationResult } from '../types';

// Removes one authorization (the API refuses while it still has files), then reloads the page
export const useDeleteAuthorization = (onDeleted: () => void): UseDeleteAuthorizationResult => {
  const slug = useInstitutionSlug();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const remove = (id: string): void => {
    setDeletingId(id);
    void runAcademicAction(deleteAuthorizationAction(slug, id))
      .then((result): void => {
        if (result.ok) onDeleted();
      })
      .finally((): void => setDeletingId(null));
  };
  return { remove, deletingId };
};
