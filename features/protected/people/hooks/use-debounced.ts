'use client';

import { useEffect, useState } from 'react';

// The value once it stops changing for a moment (search boxes)
export const useDebounced = <T,>(value: T, ms = 300): T => {
  const [settled, setSettled] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setSettled(value), ms);
    return () => clearTimeout(timer);
  }, [value, ms]);
  return settled;
};
