'use client';

import { useState } from 'react';
import { runAcademicAction } from '@/features/protected/academic/hooks/use-academic-form';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { adjustPermanenceAction } from '../actions/adjust-permanence';

// Adjusts a week of a student (present or absent, with the reason) or removes the adjustment; resolves true when saved
export const useAdjustPermanence = (onDone: () => void): { adjust: (enrollmentId: string, start: string, present: boolean, clear: boolean, reason: string) => Promise<boolean>; isAdjusting: boolean } => {
  const slug = useInstitutionSlug();
  const [isAdjusting, setIsAdjusting] = useState(false);
  const adjust = async (enrollmentId: string, start: string, present: boolean, clear: boolean, reason: string): Promise<boolean> => {
    setIsAdjusting(true);
    try {
      const r = await runAcademicAction(adjustPermanenceAction(slug, enrollmentId, start, present, clear, reason));
      if (r.ok) onDone();
      return r.ok;
    } finally {
      setIsAdjusting(false);
    }
  };
  return { adjust, isAdjusting };
};
