'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { complianceRpc } from '@/lib/api/grpc/compliance';
import type { Room } from '../types';

// Creates or edits an environment (ComplianceService.SaveRoom)
export const saveRoomAction = async (slug: string, room: Room): Promise<AcademicResult<Room>> =>
  room.id === '' || validIds(room.id) ? runRpc(slug, (token) => complianceRpc.saveRoom({ institutionSlug: slug, room }, { token }), (d) => d.room, 'Ambiente guardado.') : notFound;
