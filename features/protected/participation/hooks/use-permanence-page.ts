'use client';

import { useState } from 'react';
import type { PermanencePageState } from '../types';
import { usePermanenceBoard } from './use-permanence-board';
import { useSectionPermanence } from './use-section-permanence';

// Permanence page: the board, the section chosen (the first with students by default) and its report
export const usePermanencePage = (): PermanencePageState => {
  const board = usePermanenceBoard();
  const [picked, setPicked] = useState('');
  const sections = board.data?.sections ?? [];
  const sectionId = picked || (sections.find((s) => s.students > 0) ?? sections[0])?.id || '';
  const section = useSectionPermanence(sectionId);
  return { board, sectionId, setSectionId: setPicked, section };
};
