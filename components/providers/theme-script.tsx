'use client';

import type { JSX } from 'react';
import { themeInitScript } from './theme';

// Pre-paint theme script. Rendered only in the server HTML: React 19 skips unknown <head> nodes while hydrating,
// and never creating the <script> on the client avoids "Encountered a script tag while rendering React component"
export const ThemeScript = (): JSX.Element | null => (typeof window === 'undefined' ? <script dangerouslySetInnerHTML={{ __html: themeInitScript }} /> : null);
