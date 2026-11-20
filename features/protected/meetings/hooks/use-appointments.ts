'use client';

import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import type { RemoteState } from '@/features/protected/academic/types';
import { isTutoringEvent } from '@/hooks/use-live';
import { listAppointmentsAction } from '../actions/appointments';
import type { AppointmentList } from '../types';

// Psychology appointments of a case (psychology only)
export const useAppointments = (slug: string, caseId: string): RemoteState<AppointmentList> => useAcademicData(`psych-appointments:${slug}:${caseId}`, () => listAppointmentsAction(slug, caseId), isTutoringEvent);
