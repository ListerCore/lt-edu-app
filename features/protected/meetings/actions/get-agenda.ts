'use server';

import { runRpc } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { meetingsRpc } from '@/lib/api/grpc/meetings';
import type { LiveAgenda } from '../types';

// The person's live sessions: from a few hours ago (still open) to two weeks ahead (MeetingsService.GetAgenda)
export const getAgendaAction = async (slug: string): Promise<AcademicResult<LiveAgenda>> =>
  runRpc(
    slug,
    (token) => meetingsRpc.agenda({ institutionSlug: slug, from: '', to: '' }, { token }),
    (d) => ({ sessions: d.sessions, platformAvailable: d.platformAvailable }),
  );
