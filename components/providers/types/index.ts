import type { ReactNode } from 'react';

export type Theme = 'light' | 'dark';

export interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

export interface ThemeProviderProps {
  children: ReactNode;
}

export interface ThemeToggleProps {
  className?: string;
}

export interface AppProvidersProps {
  children: ReactNode;
}
