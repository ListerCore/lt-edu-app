'use client';

import { useState } from 'react';
import { runAcademicAction } from '@/features/protected/academic/hooks/use-academic-form';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { reorderUnitsAction } from '../actions/reorder-units';
import type { UseMoveResult } from '../types';

// Moves one unit up or down: swaps it with its neighbour and sends the whole order
export const useReorderUnits = (roomId: string, onMoved: () => void): UseMoveResult => {
  const slug = useInstitutionSlug();
  const [isMoving, setIsMoving] = useState(false);
  const move = (ids: string[], index: number, delta: -1 | 1): void => {
    const target = index + delta;
    if (target < 0 || target >= ids.length) return;
    const next = [...ids];
    [next[index], next[target]] = [next[target], next[index]];
    setIsMoving(true);
    void runAcademicAction(reorderUnitsAction(slug, roomId, next))
      .then((result): void => {
        if (result.ok) onMoved();
      })
      .finally((): void => setIsMoving(false));
  };
  return { move, isMoving };
};
