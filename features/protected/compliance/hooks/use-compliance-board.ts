'use client';

import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import type { RemoteState } from '@/features/protected/academic/types';
import { isComplianceEvent } from '@/hooks/use-live';
import { getBoardAction } from '../actions/get-board';
import type { ComplianceBoard } from '../types';

export const useComplianceBoard = (slug: string): RemoteState<ComplianceBoard> => useAcademicData(`compliance:${slug}`, () => getBoardAction(slug), isComplianceEvent);
