'use client';

import { useState } from 'react';
import { runAcademicAction } from '@/features/protected/academic/hooks/use-academic-form';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { reorderItemsAction } from '../actions/reorder-items';
import type { UseMoveResult } from '../types';

// Moves one piece of material up or down inside its unit
export const useReorderItems = (unitId: string, onMoved: () => void): UseMoveResult => {
  const slug = useInstitutionSlug();
  const [isMoving, setIsMoving] = useState(false);
  const move = (ids: string[], index: number, delta: -1 | 1): void => {
    const target = index + delta;
    if (target < 0 || target >= ids.length) return;
    const next = [...ids];
    [next[index], next[target]] = [next[target], next[index]];
    setIsMoving(true);
    void runAcademicAction(reorderItemsAction(slug, unitId, next))
      .then((result): void => {
        if (result.ok) onMoved();
      })
      .finally((): void => setIsMoving(false));
  };
  return { move, isMoving };
};
