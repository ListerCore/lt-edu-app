'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { tutoringRpc } from '@/lib/api/grpc/tutoring';
import type { TutoringMessage } from '../types';

// Writes in a conversation (TutoringService.SendMessage)
export const sendMessageAction = async (slug: string, threadId: string, body: string): Promise<AcademicResult<TutoringMessage>> =>
  validIds(threadId) ? runRpc(slug, (token) => tutoringRpc.send({ institutionSlug: slug, threadId, body: body.slice(0, 2000) }, { token }), (d) => d.message) : notFound;
