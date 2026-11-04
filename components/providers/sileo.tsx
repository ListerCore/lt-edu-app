'use client';

import type { JSX } from 'react';
import { Toaster } from 'sileo';
import { useTheme } from './theme';

// Global sileo toaster that follows the resolved light/dark theme
export const SileoToaster = (): JSX.Element => {
  const { resolvedTheme } = useTheme();
  return <Toaster position="top-center" theme={resolvedTheme} />;
};
