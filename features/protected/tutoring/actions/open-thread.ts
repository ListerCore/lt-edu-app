'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { tutoringRpc } from '@/lib/api/grpc/tutoring';
import type { ThreadView } from '../types';

// The conversation with a student (staff), or with the tutor ('' for a student account) (TutoringService.OpenThread)
export const openThreadAction = async (slug: string, studentId: string): Promise<AcademicResult<ThreadView>> =>
  studentId === '' || validIds(studentId) ? runRpc(slug, (token) => tutoringRpc.openThread({ institutionSlug: slug, studentId }, { token }), (d) => d.view) : notFound;
