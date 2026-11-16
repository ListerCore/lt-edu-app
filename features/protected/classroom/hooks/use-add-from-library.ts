'use client';

import { useState } from 'react';
import { runAcademicAction } from '@/features/protected/academic/hooks/use-academic-form';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { saveItemAction } from '../actions/save-item';
import type { LibraryItem, UseAddFromLibraryResult } from '../types';

// Adds a library entry to a unit as unpublished material; its text, link and files stay in the library
export const useAddFromLibrary = (onAdded: () => void): UseAddFromLibraryResult => {
  const slug = useInstitutionSlug();
  const [addingId, setAddingId] = useState<string | null>(null);
  const add = (unitId: string, entry: LibraryItem): void => {
    setAddingId(entry.id);
    void runAcademicAction(
      saveItemAction(
        slug,
        { id: '', unitId, kind: entry.kind, title: entry.title, body: '', url: '', complementary: false, startsAt: '', durationMinutes: undefined, recordingUrl: '', libraryItemId: entry.id, published: false },
        `«${entry.title}» agregado sin publicar.`,
      ),
    )
      .then((result): void => {
        if (result.ok) onAdded();
      })
      .finally((): void => setAddingId(null));
  };
  return { add, addingId };
};
