'use client';

import { useAcademicForm } from '@/features/protected/academic/hooks/use-academic-form';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { setExtensionAction } from '../actions/set-extension';
import { isoToLimaLocal, limaLocalToIso } from '../data/classroom-data';
import type { ExtensionValues, FormState, UseExtensionParams } from '../types';

// More time for one student (Lima time); clearing the date removes the extension
export const useSetExtension = ({ itemId, row, onSaved }: UseExtensionParams): FormState<ExtensionValues> => {
  const slug = useInstitutionSlug();
  return useAcademicForm({
    initial: { closesAt: row.extension ? isoToLimaLocal(row.extension) : '', reason: '' },
    validate: (v: ExtensionValues): Record<string, string> => (v.closesAt && !limaLocalToIso(v.closesAt) ? { closesAt: 'Indica el día y la hora.' } : {}),
    save: (v: ExtensionValues) => setExtensionAction(slug, itemId, row.studentId, limaLocalToIso(v.closesAt), v.reason.trim().slice(0, 300)),
    onSaved: () => onSaved(),
  });
};
