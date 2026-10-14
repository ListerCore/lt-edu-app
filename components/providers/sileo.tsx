'use client';

import { Toaster } from 'sileo';
import { useTheme } from './theme';

export const SileoToaster = () => {
  const { theme } = useTheme();
  return <Toaster position="top-center" theme={theme} />;
};
