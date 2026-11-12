'use client';

import { useAcademicForm } from '@/features/protected/academic/hooks/use-academic-form';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { useWorkspace } from '@/features/protected/dashboard/hooks/use-workspace';
import { saveMeetingAction } from '../actions/save-meeting';
import { fromLimaInput, toLimaInput } from '../data/apafa-data';
import type { MeetingPayload, MeetingValues, UseMeetingFormParams, UseMeetingFormResult } from '../types';

// Values of the dialog: an existing meeting as stored (date in Lima wall time), or a new one convened on save
const initialValues = (m: UseMeetingFormParams['meeting'], audience: string): MeetingValues => (m ? { title: m.title, kind: m.kind, scheduledAt: toLimaInput(m.scheduledAt), modality: m.modality, place: m.place, meetingUrl: m.meetingUrl, agenda: m.agenda, audience: m.audience, notify: false } : { title: '', kind: 'ordinary', scheduledAt: '', modality: 'in_person', place: '', meetingUrl: '', agenda: '', audience, notify: true });

// Checks what the browser can tell before the API: required fields of the chosen modality
const validate = (v: MeetingValues): Record<string, string> => {
  const errors: Record<string, string> = {};
  if (v.title.trim().length < 5) errors.title = 'Escribe un título de al menos 5 caracteres.';
  if (!fromLimaInput(v.scheduledAt)) errors.scheduled_at = 'Indica la fecha y la hora.';
  if (v.modality !== 'virtual' && !v.place.trim()) errors.place = 'Indica el lugar.';
  if (v.modality !== 'in_person' && !/^https:\/\/\S+$/.test(v.meetingUrl.trim())) errors.meeting_url = 'Pega un enlace que empiece con https://.';
  return errors;
};

// Cleans the raw values into the payload: trimmed texts, Lima offset on the date, fields the modality does not use emptied
const toPayload = (id: string, v: MeetingValues): MeetingPayload => ({
  id,
  title: v.title.trim().replace(/\s+/g, ' ').slice(0, 140),
  kind: v.kind,
  scheduledAt: fromLimaInput(v.scheduledAt),
  modality: v.modality,
  place: v.modality === 'virtual' ? '' : v.place.trim().slice(0, 200),
  meetingUrl: v.modality === 'in_person' ? '' : v.meetingUrl.trim().slice(0, 500),
  agenda: v.agenda
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .trim()
    .slice(0, 4000),
  audience: v.audience,
  notify: v.notify,
});

// Create/edit form of a meeting; on create the "Convocar y notificar" switch starts on
export const useSaveMeeting = ({ meeting, onSaved }: UseMeetingFormParams): UseMeetingFormResult => {
  const slug = useInstitutionSlug();
  // CEBA students are adults (no guardian role): their meetings are convened for the whole community
  const { institutionType } = useWorkspace();
  const form = useAcademicForm({ initial: initialValues(meeting, institutionType === 'EBA' ? 'community' : 'guardians'), validate, save: (v: MeetingValues) => saveMeetingAction(slug, toPayload(meeting?.id ?? '', v)), onSaved });
  return { ...form, isNew: !meeting, isConvened: Boolean(meeting?.notifiedAt) };
};
