'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import { classroomRpc } from '@/lib/api/grpc/classroom';
import type { AcademicResult } from '../types';

// More time for one student; an empty date removes it (ClassroomService.SetExtension)
export const setExtensionAction = async (slug: string, itemId: string, studentId: string, closesAt: string, reason: string): Promise<AcademicResult<null>> =>
  validIds(itemId, studentId)
    ? runRpc(slug, (token) => classroomRpc.setExtension({ institutionSlug: slug, itemId, studentId, closesAt, reason }, { token }), () => null, closesAt ? 'Prórroga guardada.' : 'Prórroga retirada.')
    : notFound;
