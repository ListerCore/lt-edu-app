'use server';

import { runRpc } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { meetingsRpc } from '@/lib/api/grpc/meetings';

// Whether calls inside the platform are set up (MeetingsService.GetLiveConfig)
export const getLiveConfigAction = async (slug: string): Promise<AcademicResult<boolean>> =>
  runRpc(
    slug,
    (token) => meetingsRpc.config({}, { token }),
    (d) => d.platformAvailable,
  );
