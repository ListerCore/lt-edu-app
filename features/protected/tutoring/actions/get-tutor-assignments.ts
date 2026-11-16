'use server';

import { runRpc } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { tutoringRpc } from '@/lib/api/grpc/tutoring';
import type { TutorAssignments } from '../types';

// Tutor loads, the staff who can tutor and every student with their tutor in force (TutoringService.GetTutorAssignments)
export const getTutorAssignmentsAction = async (slug: string): Promise<AcademicResult<TutorAssignments>> =>
  runRpc(slug, (token) => tutoringRpc.assignments({ institutionSlug: slug }, { token }), (d) => d);
