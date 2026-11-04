'use client';

import './boneyard';
import type { JSX } from 'react';
import { SileoToaster } from './sileo';
import { ThemeProvider } from './theme';
import { TooltipProvider } from '@/components/ui/tooltip';
import type { AppProvidersProps } from './types';

// App-wide client providers: theme, tooltips and toasts
const AppProviders = ({ children }: AppProvidersProps): JSX.Element => (
  <ThemeProvider>
    <TooltipProvider>
      {children}
      <SileoToaster />
    </TooltipProvider>
  </ThemeProvider>
);

export { AppProviders };
