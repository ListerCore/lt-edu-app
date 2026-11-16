'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { documentsRpc } from '@/lib/api/grpc/documents';
import type { CertificateBoard } from '../types';

// The student's constancias, studies and concluded cycles (DocumentsService.GetStudentCertificates)
export const getStudentCertificatesAction = async (slug: string, studentId: string): Promise<AcademicResult<CertificateBoard>> =>
  validIds(studentId) ? runRpc(slug, (token) => documentsRpc.studentCertificates({ institutionSlug: slug, studentId }, { token }), (d) => d) : notFound;
