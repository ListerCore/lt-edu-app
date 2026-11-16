'use server';

import { runRpc } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { closingRpc } from '@/lib/api/grpc/closing';
import type { PromotionRules } from '../types';

// The promotion rule of each EBA cycle (ClosingService.GetPromotionRules); fails with not_eba elsewhere
export const getPromotionRulesAction = async (slug: string): Promise<AcademicResult<PromotionRules>> =>
  runRpc(slug, (token) => closingRpc.promotionRules({ institutionSlug: slug }, { token }), (d) => d);
