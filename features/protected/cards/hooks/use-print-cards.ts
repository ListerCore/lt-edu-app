'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Cardholder, UsePrintCardsResult } from '../types';

// Renders the chosen cards into the print sheet, opens the print dialog (print or save as PDF) and clears it after
export const usePrintCards = (): UsePrintCardsResult => {
  const [printing, setPrinting] = useState<Cardholder[]>([]);

  useEffect(() => {
    if (printing.length === 0) return;
    const clear = (): void => setPrinting([]);
    window.addEventListener('afterprint', clear, { once: true });
    // Wait one frame so the sheet is in the DOM before the dialog snapshots the page
    const frame = window.requestAnimationFrame(() => window.print());
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('afterprint', clear);
    };
  }, [printing]);

  const print = useCallback((cardholders: Cardholder[]): void => setPrinting(cardholders), []);

  return { printing, print };
};
