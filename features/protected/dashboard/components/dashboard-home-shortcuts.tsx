import Link from 'next/link';
import type { JSX } from 'react';
import { ArrowUpRight } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import type { DashboardHomeShortcutsProps } from '../types';

// Quick access grid: the first modules the role can open, in sidebar order
export const DashboardHomeShortcuts = ({ shortcuts }: DashboardHomeShortcutsProps): JSX.Element | null => {
  if (shortcuts.length === 0) return null;

  return (
    <section aria-labelledby="home-shortcuts-title">
      <h2 id="home-shortcuts-title" className="text-sm font-semibold text-foreground">
        Accesos rápidos
      </h2>
      <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {shortcuts.map(({ label, href, icon }): JSX.Element => (
          <li key={href}>
            <Link href={href} className="group soft-card flex h-full flex-col gap-4 p-4 hover:border-brand/40">
              <span className="flex items-start justify-between">
                <span className="flex size-10 items-center justify-center rounded-md bg-brand-soft text-brand">
                  <MorphIcon icon={icon} size={18} />
                </span>
                <MorphIcon icon={ArrowUpRight} size={16} className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
              </span>
              <span className="text-sm leading-5 font-medium text-foreground">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};
