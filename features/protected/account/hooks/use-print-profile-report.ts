'use client';

import { useCallback, useEffect, useState } from 'react';
import { formatDateTime } from '../data/account-data';
import type { UsePrintProfileReportResult } from '../types';

// Renders the profile report with the time it was generated, opens the print dialog (print or save as PDF), then clears it
export const usePrintProfileReport = (): UsePrintProfileReportResult => {
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);

  useEffect(() => {
    if (!generatedAt) return;
    const clear = (): void => setGeneratedAt(null);
    window.addEventListener('afterprint', clear, { once: true });
    const frame = window.requestAnimationFrame(() => window.print());
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('afterprint', clear);
    };
  }, [generatedAt]);

  const print = useCallback((): void => setGeneratedAt(formatDateTime(new Date().toISOString())), []);

  return { generatedAt, print };
};
