'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { tutoringRpc } from '@/lib/api/grpc/tutoring';
import { limaLocalToIso } from '@/features/protected/classroom/data/classroom-data';
import type { SessionInput, TutoringSession } from '../types';

const optional = (id: string): boolean => id === '' || validIds(id);

// Schedules a tutoring session or changes one not held yet (TutoringService.SaveTutoringSession)
export const saveSessionAction = async (slug: string, s: SessionInput): Promise<AcademicResult<TutoringSession>> =>
  optional(s.id) && optional(s.staffId) && s.studentIds.length > 0 && validIds(...s.studentIds)
    ? runRpc(
        slug,
        (token) =>
          tutoringRpc.saveSession(
            { institutionSlug: slug, ...s, scheduledAt: limaLocalToIso(s.scheduledAt), durationMin: Math.round(s.durationMin), link: s.link.slice(0, 500), reason: s.reason.slice(0, 300) },
            { token },
          ),
        (d) => d.session,
        s.id ? 'Tutoría actualizada.' : 'Tutoría agendada.',
      )
    : notFound;
