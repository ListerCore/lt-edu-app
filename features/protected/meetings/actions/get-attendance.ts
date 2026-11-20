'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { meetingsRpc } from '@/lib/api/grpc/meetings';
import { isLiveSource } from '../data/meetings-data';
import type { Attendee } from '../types';

// Who joined a session; hosts only (MeetingsService.GetAttendance)
export const getAttendanceAction = async (slug: string, source: string, id: string): Promise<AcademicResult<Attendee[]>> =>
  isLiveSource(source) && validIds(id)
    ? runRpc(
        slug,
        (token) => meetingsRpc.attendance({ institutionSlug: slug, source, id }, { token }),
        (d) => d.attendees,
      )
    : notFound;
