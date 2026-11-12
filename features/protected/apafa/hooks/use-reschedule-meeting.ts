'use client';

import { useAcademicForm } from '@/features/protected/academic/hooks/use-academic-form';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { rescheduleMeetingAction } from '../actions/reschedule-meeting';
import { fromLimaInput } from '../data/apafa-data';
import type { FormState, Meeting, RescheduleValues } from '../types';

const validate = (v: RescheduleValues): Record<string, string> => {
  const errors: Record<string, string> = {};
  if (!fromLimaInput(v.scheduledAt)) errors.scheduled_at = 'Indica la nueva fecha y hora.';
  if (v.reason.trim().length < 5) errors.reason = 'Explica brevemente el motivo.';
  return errors;
};

// Reschedule form: new date (Lima time) and reason; notify tells the families when the meeting was already convened
export const useRescheduleMeeting = (meeting: Meeting, onDone: (m: Meeting) => void): FormState<RescheduleValues> => {
  const slug = useInstitutionSlug();
  return useAcademicForm({
    initial: { scheduledAt: '', reason: '', notify: Boolean(meeting.notifiedAt) },
    validate,
    save: (v: RescheduleValues) => rescheduleMeetingAction(slug, { id: meeting.id, scheduledAt: fromLimaInput(v.scheduledAt), reason: v.reason.trim().slice(0, 300), notify: v.notify }),
    onSaved: onDone,
  });
};
