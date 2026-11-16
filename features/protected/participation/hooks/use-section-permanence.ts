'use client';

import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { isAttendanceEvent } from '@/hooks/use-live';
import { getSectionPermanenceAction } from '../actions/get-section-permanence';
import type { RemoteState, SectionPermanence } from '../types';

// The permanence of a distance section; nothing until one is chosen. Refetches when a week is adjusted (live)
export const useSectionPermanence = (sectionId: string): RemoteState<SectionPermanence> => {
  const slug = useInstitutionSlug();
  return useAcademicData(`permanence-section:${slug}:${sectionId}`, async () => (sectionId ? getSectionPermanenceAction(slug, sectionId) : { ok: true as const, data: null as unknown as SectionPermanence }), isAttendanceEvent);
};
