'use client';

import type { JSX } from 'react';
import { SileoToaster } from './sileo';
import { ThemeProvider } from './theme';
import type { AppProvidersProps } from './types';

const AppProviders = ({ children }: AppProvidersProps): JSX.Element => (
  <ThemeProvider>
    {children}
    <SileoToaster />
  </ThemeProvider>
);

export { AppProviders };
