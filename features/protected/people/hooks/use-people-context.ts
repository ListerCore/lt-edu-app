'use client';

import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import type { RemoteState } from '@/features/protected/academic/types';
import { isAcademicEvent } from '@/hooks/use-live';
import { getPeopleContextAction } from '../actions/people-actions';
import type { PeopleContextData } from '../types';

// Institution names, rules, structure and periods for the people pages (reloaded when the structure changes)
export const usePeopleContext = (): RemoteState<PeopleContextData> & { slug: string } => {
  const slug = useInstitutionSlug();
  return { ...useAcademicData(`people-context:${slug}`, () => getPeopleContextAction(slug), isAcademicEvent), slug };
};
