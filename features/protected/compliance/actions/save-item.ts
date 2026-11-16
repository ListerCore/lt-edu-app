'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { complianceRpc } from '@/lib/api/grpc/compliance';
import type { Item } from '../types';

// Where an element lives and its evidence reference (ComplianceService.SaveItem)
export const saveItemAction = async (slug: string, it: { id: string; module: string; route: string; annex: string; folio: string; notes: string }): Promise<AcademicResult<Item>> =>
  validIds(it.id) ? runRpc(slug, (token) => complianceRpc.saveItem({ institutionSlug: slug, ...it }, { token }), (d) => d.item, 'Fila guardada.') : notFound;
