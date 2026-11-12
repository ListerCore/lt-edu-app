'use client';

import { useCallback } from 'react';
import { useWorkspace } from '@/features/protected/dashboard/hooks/use-workspace';
import { conceptOptions, paymentsCopy } from '../data/finance-data';
import type { UsePaymentsCopyResult } from '../types';

// Texts and plan concepts of the payments module for the institution's management type: public institutions show
// "Pagos" and the APAFA fee, private ones "Pensiones y pagos" with tuition
export const usePaymentsCopy = (): UsePaymentsCopyResult => {
  const { management, isPublic } = useWorkspace();
  const options = useCallback((current: string) => conceptOptions(management, current), [management]);
  return { isPublic, copy: paymentsCopy[management], conceptOptions: options };
};
