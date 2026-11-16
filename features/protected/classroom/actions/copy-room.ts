'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import { classroomRpc } from '@/lib/api/grpc/classroom';
import type { AcademicResult } from '../types';

// Copies the units and material of another room into this empty one (ClassroomService.CopyRoom)
export const copyRoomAction = async (slug: string, id: string, fromRoomId: string): Promise<AcademicResult<number>> =>
  validIds(id, fromRoomId) ? runRpc(slug, (token) => classroomRpc.copyRoom({ institutionSlug: slug, id, fromRoomId }, { token }), (d) => d.units) : notFound;
