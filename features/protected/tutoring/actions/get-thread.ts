'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { tutoringRpc } from '@/lib/api/grpc/tutoring';
import type { ThreadView } from '../types';

// A conversation with its messages, marked read (TutoringService.GetThread)
export const getThreadAction = async (slug: string, threadId: string): Promise<AcademicResult<ThreadView>> =>
  validIds(threadId) ? runRpc(slug, (token) => tutoringRpc.thread({ institutionSlug: slug, threadId }, { token }), (d) => d.view) : notFound;
