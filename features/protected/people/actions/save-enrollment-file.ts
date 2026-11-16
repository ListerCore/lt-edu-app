'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { peopleRpc } from '@/lib/api/grpc/people';
import type { EnrollmentFile, EnrollmentFileValues } from '../types';

// Saves the ficha única (PeopleService.SaveEnrollmentFile)
export const saveEnrollmentFileAction = async (slug: string, studentId: string, v: EnrollmentFileValues): Promise<AcademicResult<EnrollmentFile>> =>
  validIds(studentId)
    ? runRpc(
        slug,
        (token) =>
          peopleRpc.saveEnrollmentFile(
            {
              institutionSlug: slug,
              file: {
                studentId,
                motherTongue: v.motherTongue,
                motherTongueOther: v.motherTongueOther.slice(0, 60),
                occupation: v.occupation.slice(0, 120),
                disability: v.disability.slice(0, 200),
                internet: v.internet,
                device: v.device,
                preferredMode: v.preferredMode,
                lastStudies: v.lastStudies.slice(0, 160),
                documents: v.documents,
                updatedByName: '',
                updatedAt: '',
              },
            },
            { token },
          ),
        (d) => d.file,
        'Ficha guardada.',
      )
    : notFound;
