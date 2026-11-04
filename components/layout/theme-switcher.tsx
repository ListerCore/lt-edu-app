'use client';

import { useSyncExternalStore, type JSX } from 'react';
import { Monitor, Moon, Sun } from 'lucide';
import type { IconInput } from 'morphicons/react';
import { useTheme } from '@/components/providers/theme';
import { MorphIcon } from '@/components/ui/morph-icon';
import { cn } from '@/lib/utils';
import type { Theme, ThemeSwitcherProps } from '@/components/providers/types';

// Icons are lucide data rendered through morphicons, never lucide-react components
const options: Array<{ value: Theme; label: string; icon: IconInput }> = [
  { value: 'light', label: 'Modo claro', icon: Sun },
  { value: 'dark', label: 'Modo oscuro', icon: Moon },
  { value: 'system', label: 'Usar el modo del sistema', icon: Monitor },
];

const subscribeNoop = (): (() => void) => () => {};

// Segmented light/dark/system control; renders a placeholder until mounted so SSR markup matches
export const ThemeSwitcher = ({ className }: ThemeSwitcherProps): JSX.Element => {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribeNoop,
    (): boolean => true,
    (): boolean => false,
  );

  if (!mounted) return <div aria-hidden="true" className={cn('h-8 w-23 rounded-full bg-surface', className)} />;

  return (
    <div role="radiogroup" aria-label="Tema de color" className={cn('flex items-center gap-0.5 rounded-full bg-surface p-1', className)}>
      {options.map(({ value, label, icon }): JSX.Element => {
        const active = theme === value;
        return (
          <button key={value} type="button" role="radio" aria-checked={active} aria-label={label} title={label} onClick={(): void => setTheme(value)} className={cn('flex size-6 items-center justify-center rounded-full outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-brand/40', active ? 'bg-background text-brand shadow-sm' : 'text-muted-foreground hover:text-foreground')}>
            <MorphIcon icon={icon} size={14} strokeWidth={2.25} />
          </button>
        );
      })}
    </div>
  );
};
