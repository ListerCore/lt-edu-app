'use client';

import { useEffect, useState } from 'react';

// Index that advances every `intervalMs` and wraps around `length`; stops while `paused` or with a single item
export const useRotatingIndex = (length: number, intervalMs: number, paused = false): number => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (paused || length < 2) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % length), intervalMs);
    return () => window.clearInterval(timer);
  }, [paused, length, intervalMs]);

  return length > 0 ? index % length : 0;
};
