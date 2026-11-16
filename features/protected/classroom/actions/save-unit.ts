'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import { classroomRpc } from '@/lib/api/grpc/classroom';
import type { AcademicResult, Unit, UnitPayload } from '../types';

// Creates (empty id) or edits a unit (ClassroomService.SaveUnit)
export const saveUnitAction = async (slug: string, p: UnitPayload): Promise<AcademicResult<Unit>> =>
  (p.id && !validIds(p.id)) || (!p.id && !validIds(p.roomId))
    ? notFound
    : runRpc(
        slug,
        (token) => classroomRpc.saveUnit({ institutionSlug: slug, id: p.id, roomId: p.roomId, title: p.title, summary: p.summary, opensOn: p.opensOn, published: p.published }, { token }),
        (d) => d.unit,
        p.id ? 'Unidad actualizada.' : 'Unidad creada.',
      );
