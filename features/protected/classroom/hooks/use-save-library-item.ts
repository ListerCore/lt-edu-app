'use client';

import { useAcademicForm } from '@/features/protected/academic/hooks/use-academic-form';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { saveLibraryItemAction } from '../actions/save-library-item';
import { HTTPS_PATTERN } from '../data/classroom-data';
import type { FormState, LibraryValues, UseLibraryFormParams } from '../types';

// Create or edit a library entry; checks by kind like joseph-api
export const useSaveLibraryItem = ({ entry, onSaved }: UseLibraryFormParams): FormState<LibraryValues> => {
  const slug = useInstitutionSlug();
  return useAcademicForm({
    initial: entry ? { kind: entry.kind, title: entry.title, description: entry.description, body: entry.body, url: entry.url, topic: entry.topic } : { kind: 'file', title: '', description: '', body: '', url: '', topic: '' },
    validate: (v: LibraryValues): Record<string, string> => {
      const errors: Record<string, string> = {};
      if (v.title.trim().length < 2) errors.title = 'Escribe el título.';
      if (v.url.trim() && !HTTPS_PATTERN.test(v.url.trim())) errors.url = 'Escribe una dirección que empiece con https://.';
      if (v.kind === 'reading' && !v.body.trim()) errors.body = 'Escribe el contenido.';
      if ((v.kind === 'video' || v.kind === 'link') && !v.url.trim()) errors.url = 'Pega la dirección.';
      return errors;
    },
    save: (v: LibraryValues) =>
      saveLibraryItemAction(slug, {
        id: entry?.id ?? '',
        kind: v.kind,
        title: v.title.trim().replace(/\s+/g, ' ').slice(0, 160),
        description: v.description.trim().slice(0, 1000),
        body: v.kind === 'reading' ? v.body.trim().slice(0, 20000) : '',
        url: v.kind === 'video' || v.kind === 'link' ? v.url.trim() : '',
        topic: v.topic.trim().replace(/\s+/g, ' ').slice(0, 80),
      }),
    onSaved: () => onSaved(),
  });
};
