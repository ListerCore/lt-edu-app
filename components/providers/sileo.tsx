'use client';

import type { JSX } from 'react';
import { Toaster } from 'sileo';
import { useTheme } from './theme';

export const SileoToaster = (): JSX.Element => {
  const { theme } = useTheme();
  return <Toaster position="top-center" theme={theme} />;
};
