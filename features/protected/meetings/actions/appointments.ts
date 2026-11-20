'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { limaLocalToIso } from '@/features/protected/classroom/data/classroom-data';
import { meetingsRpc } from '@/lib/api/grpc/meetings';
import type { Appointment, AppointmentInput, AppointmentList } from '../types';

// Psychology appointments of a case (MeetingsService.ListAppointments)
export const listAppointmentsAction = async (slug: string, caseId: string): Promise<AcademicResult<AppointmentList>> =>
  validIds(caseId)
    ? runRpc(
        slug,
        (token) => meetingsRpc.appointments({ institutionSlug: slug, caseId }, { token }),
        (d) => ({ appointments: d.appointments, platformAvailable: d.platformAvailable }),
      )
    : notFound;

// Schedules or reschedules an appointment (MeetingsService.SaveAppointment)
export const saveAppointmentAction = async (slug: string, a: AppointmentInput): Promise<AcademicResult<Appointment>> =>
  validIds(a.caseId) && (a.id === '' || validIds(a.id))
    ? runRpc(
        slug,
        (token) => meetingsRpc.saveAppointment({ institutionSlug: slug, id: a.id, caseId: a.caseId, scheduledAt: limaLocalToIso(a.scheduledAt), durationMin: Math.round(a.durationMin), mode: a.mode, provider: a.provider, link: a.link.trim().slice(0, 500) }, { token }),
        (d) => d.appointment,
        a.id ? 'Cita actualizada.' : 'Cita agendada.',
      )
    : notFound;

// Marks an appointment held, missed or cancelled (MeetingsService.SetAppointmentStatus)
export const setAppointmentStatusAction = async (slug: string, id: string, status: string): Promise<AcademicResult<Appointment>> =>
  validIds(id)
    ? runRpc(
        slug,
        (token) => meetingsRpc.appointmentStatus({ institutionSlug: slug, id, status }, { token }),
        (d) => d.appointment,
        'Cita actualizada.',
      )
    : notFound;
