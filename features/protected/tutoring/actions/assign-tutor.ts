'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { tutoringRpc } from '@/lib/api/grpc/tutoring';
import type { TutorAssignments } from '../types';

// Gives students a tutor of their own; staffId '' brings them back to their section's (TutoringService.AssignTutor)
export const assignTutorAction = async (slug: string, studentIds: string[], staffId: string): Promise<AcademicResult<TutorAssignments>> =>
  studentIds.length > 0 && validIds(...studentIds) && (staffId === '' || validIds(staffId))
    ? runRpc(slug, (token) => tutoringRpc.assign({ institutionSlug: slug, studentIds, staffId }, { token }), (d) => d.assignments, staffId ? 'Tutor asignado.' : 'Vuelven al tutor de su sección.')
    : notFound;
