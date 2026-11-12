'use client';

import { useTransition } from 'react';
import { runAcademicAction } from '@/features/protected/academic/hooks/use-academic-form';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { conveneMeetingAction } from '../actions/convene-meeting';
import type { UseMeetingActionParams, UseRunActionResult } from '../types';

// Convenes a draft meeting (publishes the notice for the families) with a toast
export const useConveneMeeting = ({ meetingId, onDone }: UseMeetingActionParams): UseRunActionResult => {
  const slug = useInstitutionSlug();
  const [isPending, startTransition] = useTransition();
  const run = (): void =>
    startTransition(async (): Promise<void> => {
      const result = await runAcademicAction(conveneMeetingAction(slug, meetingId));
      if (result.ok) onDone(result.data);
    });
  return { run, isPending };
};
