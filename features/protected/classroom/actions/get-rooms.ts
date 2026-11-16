'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import { classroomRpc } from '@/lib/api/grpc/classroom';
import type { AcademicResult, CatalogData, ClassroomMode } from '../types';

// Rooms the person reaches in a period (empty: the period in course) (ClassroomService.ListRooms)
export const getRoomsAction = async (slug: string, periodId: string): Promise<AcademicResult<CatalogData>> =>
  periodId && !validIds(periodId)
    ? notFound
    : runRpc(
        slug,
        (token) => classroomRpc.rooms({ institutionSlug: slug, periodId }, { token }),
        (d) => ({ periods: d.periods, periodId: d.periodId, rooms: d.rooms, canManage: d.canManage, mode: (d.mode || 'reader') as ClassroomMode }),
      );
