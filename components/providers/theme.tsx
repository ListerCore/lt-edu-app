'use client';

import { createContext, use, useCallback, useEffect, useMemo, useSyncExternalStore, type JSX } from 'react';
import type { ResolvedTheme, Theme, ThemeContextValue, ThemeProviderProps } from './types';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const THEME_STORAGE_KEY = 'lt-edu-theme';
const DARK_QUERY = '(prefers-color-scheme: dark)';

// Reads the stored preference; anything unknown falls back to following the OS
const getThemeSnapshot = (): Theme => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
  } catch {
    // Storage can be blocked (private mode); keep the default
  }
  return 'system';
};

// OS preference, only consulted when the theme is "system"
const getSystemSnapshot = (): ResolvedTheme => (window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light');

const getServerTheme = (): Theme => 'system';
const getServerSystem = (): ResolvedTheme => 'light';

// Re-renders on cross-tab storage changes and on our own synthetic storage events
const subscribeTheme = (callback: () => void): (() => void) => {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
};

// Re-renders when the OS switches between light and dark
const subscribeSystem = (callback: () => void): (() => void) => {
  const media = window.matchMedia(DARK_QUERY);
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
};

// Holds the light/dark/system preference and keeps the <html> class in sync
export const ThemeProvider = ({ children }: ThemeProviderProps): JSX.Element => {
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerTheme);
  const system = useSyncExternalStore(subscribeSystem, getSystemSnapshot, getServerSystem);
  const resolvedTheme: ResolvedTheme = theme === 'system' ? system : theme;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
  }, [resolvedTheme]);

  const setTheme = useCallback((next: Theme): void => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Without storage the choice only lasts for this page view
    }
    // The native storage event only fires in other tabs, so notify this one manually
    window.dispatchEvent(new StorageEvent('storage', { key: THEME_STORAGE_KEY }));
  }, []);

  const value = useMemo(() => ({ theme, resolvedTheme, setTheme }), [theme, resolvedTheme, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// Access to the current theme; must be used inside ThemeProvider
export const useTheme = (): ThemeContextValue => {
  const context = use(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};

// Inline script that applies the theme class before hydration to avoid a flash
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');var d=t==='dark'||((t!=='light')&&window.matchMedia('${DARK_QUERY}').matches);document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;
