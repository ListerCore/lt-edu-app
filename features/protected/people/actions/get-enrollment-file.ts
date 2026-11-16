'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { peopleRpc } from '@/lib/api/grpc/people';
import type { EnrollmentFile } from '../types';

// The student's ficha única (PeopleService.GetEnrollmentFile)
export const getEnrollmentFileAction = async (slug: string, studentId: string): Promise<AcademicResult<EnrollmentFile>> =>
  validIds(studentId) ? runRpc(slug, (token) => peopleRpc.enrollmentFile({ institutionSlug: slug, studentId }, { token }), (d) => d.file) : notFound;
