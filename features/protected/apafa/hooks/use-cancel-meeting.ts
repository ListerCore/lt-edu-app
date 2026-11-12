'use client';

import { useAcademicForm } from '@/features/protected/academic/hooks/use-academic-form';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { cancelMeetingAction } from '../actions/cancel-meeting';
import type { CancelValues, FormState, Meeting } from '../types';

// Cancel form: the reason, and whether to tell the families (only meaningful once convened)
export const useCancelMeeting = (meeting: Meeting, onDone: (m: Meeting) => void): FormState<CancelValues> => {
  const slug = useInstitutionSlug();
  return useAcademicForm({
    initial: { reason: '', notify: Boolean(meeting.notifiedAt) },
    validate: (v: CancelValues): Record<string, string> => (v.reason.trim().length < 5 ? { reason: 'Explica brevemente el motivo.' } : {}),
    save: (v: CancelValues) => cancelMeetingAction(slug, { id: meeting.id, reason: v.reason.trim().slice(0, 300), notify: v.notify }),
    onSaved: onDone,
  });
};
