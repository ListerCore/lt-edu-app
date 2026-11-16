'use client';

import { useCallback, useRef } from 'react';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { recordViewAction } from '../actions/record-view';

// Counts a student opening material, quietly (no toast) and once per item while the page is open
export const useRecordView = (enabled: boolean): ((itemId: string) => void) => {
  const slug = useInstitutionSlug();
  const sent = useRef(new Set<string>());
  return useCallback(
    (itemId: string): void => {
      if (!enabled || sent.current.has(itemId)) return;
      sent.current.add(itemId);
      void recordViewAction(slug, itemId);
    },
    [enabled, slug],
  );
};
