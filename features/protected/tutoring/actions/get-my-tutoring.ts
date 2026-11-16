'use server';

import { notFound, runRpc } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { tutoringRpc } from '@/lib/api/grpc/tutoring';
import type { MyTutoring } from '../types';

// A student's tutoring: the tutor, the sessions and the conversation (TutoringService.GetMyTutoring)
export const getMyTutoringAction = async (slug: string): Promise<AcademicResult<MyTutoring>> =>
  slug === '' ? notFound : runRpc(slug, (token) => tutoringRpc.mine({ institutionSlug: slug }, { token }), (d) => d);
