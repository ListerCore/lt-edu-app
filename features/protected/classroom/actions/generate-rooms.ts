'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import { classroomRpc } from '@/lib/api/grpc/classroom';
import type { AcademicResult } from '../types';

// Creates the missing rooms of the period from the plans in force (ClassroomService.GenerateRooms)
export const generateRoomsAction = async (slug: string, periodId: string): Promise<AcademicResult<number>> =>
  validIds(periodId) ? runRpc(slug, (token) => classroomRpc.generateRooms({ institutionSlug: slug, periodId }, { token }), (d) => d.created) : notFound;
