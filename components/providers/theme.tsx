'use client';

import { createContext, use, useCallback, useEffect, useMemo, useSyncExternalStore, type JSX } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Theme, ThemeContextValue, ThemeProviderProps, ThemeToggleProps } from './types';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
const STORAGE_KEY = 'sige-jl-theme';

const getSnapshot = (): Theme => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return 'dark';
};

const getServerSnapshot = (): Theme => 'dark';

const subscribe = (callback: () => void): (() => void) => {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
};

export const ThemeProvider = ({ children }: ThemeProviderProps): JSX.Element => {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = useCallback((): void => {
    const next: Theme = getSnapshot() === 'light' ? 'dark' : 'light';
    localStorage.setItem(STORAGE_KEY, next);
    window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }));
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const context = use(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};

const ThemeToggle = ({ className }: ThemeToggleProps): JSX.Element => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} className={cn('rounded-full hover:bg-primary/10 hover:text-primary', className)} aria-label={theme === 'light' ? 'Activar tema oscuro' : 'Activar tema claro'}>
      {theme === 'light' ? <Moon className="size-4" /> : <Sun className="size-4" />}
    </Button>
  );
};

export { ThemeToggle };
