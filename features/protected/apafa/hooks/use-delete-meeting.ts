'use client';

import { useTransition } from 'react';
import { runAcademicAction } from '@/features/protected/academic/hooks/use-academic-form';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { deleteMeetingAction } from '../actions/delete-meeting';
import type { UseDeleteMeetingParams, UseRunActionResult } from '../types';

// Deletes a draft meeting with a toast, then leaves the page
export const useDeleteMeeting = ({ meetingId, onDeleted }: UseDeleteMeetingParams): UseRunActionResult => {
  const slug = useInstitutionSlug();
  const [isPending, startTransition] = useTransition();
  const run = (): void =>
    startTransition(async (): Promise<void> => {
      const result = await runAcademicAction(deleteMeetingAction(slug, meetingId));
      if (result.ok) onDeleted();
    });
  return { run, isPending };
};
