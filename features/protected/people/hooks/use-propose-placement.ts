'use client';

import { useState } from 'react';
import { sileo } from 'sileo';
import { proposePlacementAction } from '../actions/propose-placement';
import type { PlacementProposal } from '../types';

// Asks the cuadro de equivalencias for the cycle and grade of the EBR studies a student brings
export const useProposePlacement = (slug: string): { propose: (origin: string, passed: number) => Promise<PlacementProposal | null>; isProposing: boolean } => {
  const [isProposing, setIsProposing] = useState(false);
  const propose = async (origin: string, passed: number): Promise<PlacementProposal | null> => {
    setIsProposing(true);
    try {
      const r = await proposePlacementAction(slug, origin, passed);
      if (!r.ok) {
        sileo.error({ title: 'Sin propuesta', description: r.message });
        return null;
      }
      return r.data;
    } finally {
      setIsProposing(false);
    }
  };
  return { propose, isProposing };
};
