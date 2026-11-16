'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { closingRpc } from '@/lib/api/grpc/closing';
import type { SectionClosing } from '../types';

// SIAGIE loading state of the final grades of some students, every one when none (ClosingService.SetSiagieGrades)
export const setSiagieGradesAction = async (slug: string, sectionId: string, studentIds: string[], status: string, note: string): Promise<AcademicResult<SectionClosing>> =>
  validIds(sectionId, ...studentIds)
    ? runRpc(slug, (token) => closingRpc.setSiagieGrades({ institutionSlug: slug, sectionId, studentIds, status, note: note.slice(0, 300) }, { token }), (d) => d.section, 'Estado del SIAGIE actualizado.')
    : notFound;
