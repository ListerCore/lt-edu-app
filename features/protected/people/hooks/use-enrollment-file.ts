'use client';

import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import type { RemoteState } from '@/features/protected/academic/types';
import { getEnrollmentFileAction } from '../actions/get-enrollment-file';
import type { EnrollmentFile } from '../types';

// The student's ficha única (EBA)
export const useEnrollmentFile = (slug: string, studentId: string): RemoteState<EnrollmentFile> => useAcademicData(`enrollment-file:${slug}:${studentId}`, () => getEnrollmentFileAction(slug, studentId));
