'use client';

import { useAcademicForm } from '@/features/protected/academic/hooks/use-academic-form';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { recordMinutesAction } from '../actions/record-minutes';
import type { FormState, Meeting, MinutesValues } from '../types';

// "", "42" → undefined, 42 (anything else is caught by validate)
const toCount = (v: string): number | undefined => (/^\d{1,5}$/.test(v.trim()) ? Number(v.trim()) : undefined);

const validate = (v: MinutesValues): Record<string, string> => {
  const errors: Record<string, string> = {};
  if (v.minutes.trim().length < 10) errors.minutes = 'Resume el acta en al menos 10 caracteres.';
  if (v.attendees.trim() !== '' && toCount(v.attendees) === undefined) errors.attendees = 'Escribe solo el número de asistentes.';
  return errors;
};

// "Marcar realizada" / edit the acta: summary, agreements (one per line) and attendees; publish sends the acta notice
export const useRecordMinutes = (meeting: Meeting, onDone: (m: Meeting) => void): FormState<MinutesValues> => {
  const slug = useInstitutionSlug();
  return useAcademicForm({
    initial: { minutes: meeting.minutes, agreements: meeting.agreements, attendees: meeting.attendees === undefined ? '' : String(meeting.attendees), publish: !meeting.minutesPublishedAt },
    validate,
    save: (v: MinutesValues) => recordMinutesAction(slug, { id: meeting.id, minutes: v.minutes.trim().slice(0, 6000), agreements: v.agreements.trim().slice(0, 4000), attendees: toCount(v.attendees), publish: v.publish }),
    onSaved: onDone,
  });
};
