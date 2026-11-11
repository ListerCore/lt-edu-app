'use client';

import { useRef, useState, type JSX, type KeyboardEvent } from 'react';
import { Check } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { revealDelay } from '@/lib/reveal';
import { cn } from '@/lib/utils';
import { platformModules } from '../data/landing-data';
import type { ModuleRow } from '../types';

const toneClass: Record<NonNullable<ModuleRow['tone']>, string> = {
  success: 'bg-success/12 text-success',
  warning: 'bg-warning/12 text-warning',
  brand: 'bg-brand-soft text-brand',
  muted: 'bg-secondary text-muted-foreground',
};

// Módulos: one area at a time, chosen from the list; the right side shows the first screen of that area and what it covers
export const LandingModules = (): JSX.Element => {
  const [activeId, setActiveId] = useState(platformModules[0].id);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeIndex = platformModules.findIndex(({ id }) => id === activeId);
  const active = platformModules[activeIndex];

  // Arrow keys move between areas, as in any tab list
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    const step = event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : event.key === 'ArrowUp' || event.key === 'ArrowLeft' ? -1 : 0;
    if (step === 0) return;
    event.preventDefault();
    const next = (activeIndex + step + platformModules.length) % platformModules.length;
    setActiveId(platformModules[next].id);
    tabs.current[next]?.focus();
  };

  return (
    <section id="modules" aria-labelledby="modules-title" className="scroll-mt-16 border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-8 md:py-32">
        <div className="max-w-2xl">
          <h2 id="modules-title" data-reveal className="text-[clamp(2.1rem,4.2vw,3.25rem)] leading-tight font-semibold tracking-[-0.03em] text-balance text-foreground">
            Cada área del colegio, conectada con las demás
          </h2>
          <p data-reveal style={revealDelay(90)} className="mt-4 text-lg leading-8 text-muted-foreground">
            La matrícula alimenta la asistencia, la asistencia llega a las familias y las notas terminan en la libreta. Nada se copia dos veces.
          </p>
        </div>

        <div data-reveal style={revealDelay(160)} className="mt-14 grid gap-8 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-12">
          <div role="tablist" aria-label="Módulos" aria-orientation="vertical" onKeyDown={onKeyDown} className="-mx-6 flex gap-1.5 overflow-x-auto px-6 pb-1 [scrollbar-width:none] md:mx-0 md:px-0 lg:flex-col lg:overflow-visible lg:pb-0">
            {platformModules.map(({ id, icon, name, summary }, index): JSX.Element => {
              const selected = id === activeId;
              return (
                <button
                  key={id}
                  ref={(node): void => {
                    tabs.current[index] = node;
                  }}
                  type="button"
                  role="tab"
                  id={`module-tab-${id}`}
                  aria-selected={selected}
                  aria-controls={`module-panel-${id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={(): void => setActiveId(id)}
                  className={cn('flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors lg:shrink lg:items-start lg:gap-4 lg:px-4 lg:py-3.5', selected ? 'bg-background shadow-[0_12px_30px_-18px_rgb(43_33_27/0.35)] ring-1 ring-border' : 'hover:bg-background/60')}
                >
                  <span className={cn('flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors lg:size-10', selected ? 'bg-brand-solid text-white' : 'bg-secondary text-foreground')}>
                    <MorphIcon icon={icon} size={18} />
                  </span>
                  <span className="min-w-0">
                    <span className={cn('block font-semibold', selected ? 'text-foreground' : 'text-foreground/80')}>{name}</span>
                    <span className={cn('mt-1 hidden text-sm leading-6 text-muted-foreground', selected && 'lg:block')}>{summary}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div role="tabpanel" id={`module-panel-${active.id}`} aria-labelledby={`module-tab-${active.id}`} className="grid gap-8 rounded-2xl border border-border bg-background p-5 md:grid-cols-[1.4fr_1fr] md:p-8">
            <p className="text-base leading-7 text-muted-foreground md:col-span-2 lg:hidden">{active.summary}</p>

            <div key={active.id} className="row-in min-w-0">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-lg font-semibold text-foreground">{active.preview.title}</h3>
                <p className="text-sm text-muted-foreground">{active.preview.caption}</p>
              </div>
              <ul className="mt-4 divide-y divide-border rounded-xl border border-border">
                {active.preview.rows.map(({ label, detail, value, tone = 'muted' }): JSX.Element => (
                  <li key={label} className="flex items-center gap-4 px-4 py-3.5">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-foreground">{label}</span>
                      <span className="block text-xs text-muted-foreground">{detail}</span>
                    </span>
                    <span className={cn('pill tabular-nums', toneClass[tone])}>{value}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div key={`${active.id}-features`} className="row-in">
              <h3 className="text-sm font-semibold text-foreground">Incluye</h3>
              <ul className="mt-4 space-y-3">
                {active.features.map((feature): JSX.Element => (
                  <li key={feature} className="flex items-start gap-3 text-base leading-6 text-muted-foreground">
                    <MorphIcon icon={Check} size={16} strokeWidth={2.5} className="mt-1 shrink-0 text-success" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
