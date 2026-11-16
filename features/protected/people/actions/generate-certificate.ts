'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { documentsRpc } from '@/lib/api/grpc/documents';
import type { CertificateInput, StudentCertificate } from '../types';

const optional = (...ids: string[]): boolean => ids.every((id) => id === '' || validIds(id));

// Issues a constancia as a version for its signers (DocumentsService.GenerateCertificate)
export const generateCertificateAction = async (slug: string, input: CertificateInput): Promise<AcademicResult<StudentCertificate>> =>
  validIds(input.studentId) && optional(input.periodId, input.levelId)
    ? runRpc(
        slug,
        (token) => documentsRpc.generateCertificate({ institutionSlug: slug, ...input, purpose: input.purpose.slice(0, 160), note: '' }, { token, timeoutMs: 60_000 }),
        (d) => d.certificate,
        'Constancia emitida: falta la firma.',
      )
    : notFound;
