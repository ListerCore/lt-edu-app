'use client';

import { DATE_PATTERN } from '@/features/protected/academic/data/academic-data';
import { useAcademicForm } from '@/features/protected/academic/hooks/use-academic-form';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { saveUnitAction } from '../actions/save-unit';
import type { FormState, UnitValues, UseUnitFormParams } from '../types';

// Create or edit a unit: title with single spaces, summary trimmed, optional opening date
export const useSaveUnit = ({ roomId, unit, onSaved }: UseUnitFormParams): FormState<UnitValues> => {
  const slug = useInstitutionSlug();
  return useAcademicForm({
    initial: unit ? { title: unit.title, summary: unit.summary, opensOn: unit.opensOn, published: unit.published } : { title: '', summary: '', opensOn: '', published: false },
    validate: (v: UnitValues): Record<string, string> => ({
      ...(v.title.trim().length < 2 ? { title: 'Escribe el título de la unidad.' } : {}),
      ...(v.opensOn && !DATE_PATTERN.test(v.opensOn) ? { opensOn: 'Fecha no válida.' } : {}),
    }),
    save: (v: UnitValues) =>
      saveUnitAction(slug, { id: unit?.id ?? '', roomId, title: v.title.trim().replace(/\s+/g, ' ').slice(0, 160), summary: v.summary.trim().slice(0, 2000), opensOn: v.opensOn, published: v.published }),
    onSaved: () => onSaved(),
  });
};
