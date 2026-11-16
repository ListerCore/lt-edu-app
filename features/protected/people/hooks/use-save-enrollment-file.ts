'use client';

import { useAcademicForm } from '@/features/protected/academic/hooks/use-academic-form';
import { saveEnrollmentFileAction } from '../actions/save-enrollment-file';
import type { EnrollmentFile, EnrollmentFileValues } from '../types';

// The ficha's form: starts from what is saved, checks the other tongue and saves through the API
export const useSaveEnrollmentFile = (slug: string, file: EnrollmentFile, onSaved: () => void): ReturnType<typeof useAcademicForm<EnrollmentFileValues, EnrollmentFile>> =>
  useAcademicForm<EnrollmentFileValues, EnrollmentFile>({
    initial: {
      motherTongue: file.motherTongue || 'castellano',
      motherTongueOther: file.motherTongueOther,
      occupation: file.occupation,
      disability: file.disability,
      internet: file.internet || 'unknown',
      device: file.device || 'unknown',
      preferredMode: file.preferredMode,
      lastStudies: file.lastStudies,
      documents: file.documents,
    },
    validate: (v): Record<string, string> => (v.motherTongue === 'other' && !v.motherTongueOther.trim() ? { motherTongueOther: 'Escribe cuál es.' } : {}),
    save: (v) => saveEnrollmentFileAction(slug, file.studentId, v),
    onSaved,
  });
