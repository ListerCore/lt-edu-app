'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import { classroomRpc } from '@/lib/api/grpc/classroom';
import type { AcademicResult, Delivery } from '../types';

// Students of itinerant sections and the delivery of the unit's printed package (ClassroomService.ListDeliveries)
export const getDeliveriesAction = async (slug: string, unitId: string): Promise<AcademicResult<Delivery[]>> =>
  validIds(unitId) ? runRpc(slug, (token) => classroomRpc.deliveries({ institutionSlug: slug, unitId }, { token }), (d) => d.deliveries) : notFound;
