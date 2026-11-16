'use server';

import { notFound, runRpc } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { tutoringRpc } from '@/lib/api/grpc/tutoring';
import type { Thread } from '../types';

// The viewer's conversations (TutoringService.ListThreads)
export const listThreadsAction = async (slug: string): Promise<AcademicResult<Thread[]>> =>
  slug === '' ? notFound : runRpc(slug, (token) => tutoringRpc.threads({ institutionSlug: slug }, { token }), (d) => d.threads);
