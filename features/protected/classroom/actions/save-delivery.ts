'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import { classroomRpc } from '@/lib/api/grpc/classroom';
import type { AcademicResult, DeliveryPayload } from '../types';

// Records (or clears, with no delivery date) the delivery of a printed unit (ClassroomService.SaveDelivery)
export const saveDeliveryAction = async (slug: string, p: DeliveryPayload): Promise<AcademicResult<null>> =>
  validIds(p.unitId, p.studentId)
    ? runRpc(
        slug,
        (token) =>
          classroomRpc.saveDelivery(
            { institutionSlug: slug, delivery: { unitId: p.unitId, studentId: p.studentId, deliveredOn: p.deliveredOn, returnedOn: p.returnedOn, notes: p.notes, studentName: '', studentCode: '', recordedByName: '' } },
            { token },
          ),
        () => null,
      )
    : notFound;
