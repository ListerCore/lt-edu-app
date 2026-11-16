'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { complianceRpc } from '@/lib/api/grpc/compliance';
import type { Item } from '../types';

// Marks a row pending, verified (technical lead, with evidence) or not applicable (ComplianceService.SetItemStatus)
export const setItemStatusAction = async (slug: string, id: string, status: string): Promise<AcademicResult<Item>> =>
  validIds(id) ? runRpc(slug, (token) => complianceRpc.itemStatus({ institutionSlug: slug, id, status }, { token }), (d) => d.item) : notFound;
