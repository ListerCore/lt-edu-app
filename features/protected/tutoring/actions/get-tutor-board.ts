'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { tutoringRpc } from '@/lib/api/grpc/tutoring';
import type { TutorBoard } from '../types';

const optional = (id: string): boolean => id === '' || validIds(id);

// The tutor's board; staffId lets dirección look at another tutor's (TutoringService.GetTutorBoard)
export const getTutorBoardAction = async (slug: string, staffId: string): Promise<AcademicResult<TutorBoard>> =>
  optional(staffId) ? runRpc(slug, (token) => tutoringRpc.board({ institutionSlug: slug, staffId }, { token }), (d) => d) : notFound;
