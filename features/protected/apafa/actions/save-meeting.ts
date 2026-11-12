'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import { apafaRpc } from '@/lib/api/grpc/apafa';
import type { AcademicResult, Meeting, MeetingPayload } from '../types';

// Schedules a new meeting (empty id) or edits one; notify convenes it or tells the families what changed (ApafaService.SaveMeeting)
export const saveMeetingAction = async (slug: string, p: MeetingPayload): Promise<AcademicResult<Meeting>> => {
  if (p.id && !validIds(p.id)) return notFound;
  const success = p.id ? (p.notify ? 'Reunión actualizada y familias avisadas.' : 'Reunión actualizada.') : p.notify ? 'Reunión convocada: las familias ya tienen el aviso.' : 'Reunión guardada sin convocar.';
  return runRpc(
    slug,
    (token) =>
      apafaRpc.saveMeeting(
        {
          institutionSlug: slug,
          notify: p.notify,
          meeting: {
            id: p.id,
            title: p.title,
            kind: p.kind,
            scheduledAt: p.scheduledAt,
            modality: p.modality,
            place: p.place,
            meetingUrl: p.meetingUrl,
            agenda: p.agenda,
            audience: p.audience,
            // Read-only on the API side
            status: '',
            previousAt: '',
            rescheduleReason: '',
            cancelReason: '',
            minutes: '',
            agreements: '',
            minutesPublishedAt: '',
            announcementId: '',
            notifiedAt: '',
            createdName: '',
            createdAt: '',
            updatedAt: '',
            files: 0,
          },
        },
        { token },
      ),
    (d) => d.meeting,
    success,
  );
};
