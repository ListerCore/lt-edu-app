'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { meetingsRpc } from '@/lib/api/grpc/meetings';
import { isLiveSource } from '../data/meetings-data';
import type { JoinInfo } from '../types';

// Enters a live session: the Meet link, or the token for the call inside the platform (MeetingsService.JoinSession)
export const joinSessionAction = async (slug: string, source: string, id: string): Promise<AcademicResult<JoinInfo>> =>
  isLiveSource(source) && validIds(id)
    ? runRpc(
        slug,
        (token) => meetingsRpc.join({ institutionSlug: slug, source, id }, { token }),
        (d) => d,
      )
    : notFound;
