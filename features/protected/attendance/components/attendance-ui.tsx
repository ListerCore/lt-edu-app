'use client';

import type { JSX, ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { cn } from '@/lib/utils';
import { formatLongDay, markBar, markClass, markLabels, markLetters, markOrder, markSolid, shiftDay, tallyTotal } from '../data/attendance-data';
import type { Tally } from '../types';

export const MarkPill = ({ status, className }: { status: string; className?: string }): JSX.Element => <span className={cn('pill', markClass[status] ?? markClass[''], className)}>{markLabels[status] ?? status}</span>;

interface MarkPickerProps {
  value: string;
  onChange: (status: string) => void;
  disabled?: boolean;
  label: string;
  // Offer "justificada" (the office and tutors; a teacher's class follows the approved justifications)
  withJustified?: boolean;
}

// P · T · F · J: one tap per student, the way a paper register is filled
export const MarkPicker = ({ value, onChange, disabled, label, withJustified = true }: MarkPickerProps): JSX.Element => (
  <div role="radiogroup" aria-label={label} className="inline-flex gap-1">
    {markOrder
      .filter((s) => withJustified || s !== 'justified' || value === 'justified')
      .map((s) => {
        const on = value === s;
        return (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={on}
            aria-label={markLabels[s]}
            title={markLabels[s]}
            disabled={disabled}
            onClick={(): void => onChange(s)}
            className={cn(
              'flex size-9 items-center justify-center rounded-lg border text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60',
              on ? markSolid[s] : 'border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground',
            )}
          >
            {markLetters[s]}
          </button>
        );
      })}
  </div>
);

interface DayPickerProps {
  day: string;
  today: string;
  onChange: (day: string) => void;
}

// Yesterday / tomorrow arrows around the day being looked at; the future is not offered
export const DayPicker = ({ day, today, onChange }: DayPickerProps): JSX.Element => (
  <div className="flex items-center gap-2">
    <button type="button" className="btn-alt size-10 p-0" aria-label="Día anterior" onClick={(): void => onChange(shiftDay(day, -1))}>
      <MorphIcon icon={ChevronLeft} size={16} />
    </button>
    <label className="relative">
      <span className="sr-only">Día</span>
      <input
        type="date"
        value={day}
        max={today || undefined}
        onChange={(e): void => {
          if (e.target.value) onChange(e.target.value);
        }}
        className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground tabular-nums"
      />
    </label>
    <button type="button" className="btn-alt size-10 p-0" aria-label="Día siguiente" disabled={!today || day >= today} onClick={(): void => onChange(shiftDay(day, 1))}>
      <MorphIcon icon={ChevronRight} size={16} />
    </button>
    {today && day !== today && (
      <button type="button" className="btn-alt h-10" onClick={(): void => onChange(today)}>
        Hoy
      </button>
    )}
    <span className="hidden text-sm text-muted-foreground md:inline">{day === today ? 'Hoy, ' + formatLongDay(day).toLowerCase() : formatLongDay(day)}</span>
  </div>
);

// One stacked bar per section or student: present, late, justified, absent, and what is still unmarked
export const TallyBar = ({ tally, total, className }: { tally?: Tally; total?: number; className?: string }): JSX.Element => {
  const marked = tallyTotal(tally);
  const base = Math.max(total ?? marked, marked, 1);
  return (
    <div className={cn('flex h-2 w-full overflow-hidden rounded-full bg-secondary', className)} aria-hidden="true">
      {(['present', 'late', 'justified', 'absent'] as const).map((s) => {
        const v = tally?.[s] ?? 0;
        return v > 0 ? <span key={s} className={markBar[s]} style={{ width: `${(v * 100) / base}%` }} /> : null;
      })}
    </div>
  );
};

// The four counts in words, for screen readers and the legend under the bars
export const TallyLine = ({ tally, unmarked }: { tally?: Tally; unmarked?: number }): JSX.Element => (
  <p className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground tabular-nums">
    <span>
      <span className="text-success">●</span> {tally?.present ?? 0} presentes
    </span>
    <span>
      <span className="text-warning">●</span> {tally?.late ?? 0} tardanzas
    </span>
    <span>
      <span className="text-destructive">●</span> {tally?.absent ?? 0} faltas
    </span>
    <span>
      <span className="text-brand">●</span> {tally?.justified ?? 0} justificadas
    </span>
    {unmarked !== undefined && unmarked > 0 && <span>{unmarked} sin marcar</span>}
  </p>
);

export const Tabs = <T extends string>({ tabs, current, onChange, label }: { tabs: Array<[T, string, number?]>; current: T; onChange: (tab: T) => void; label: string }): JSX.Element => (
  <div role="tablist" aria-label={label} className="flex gap-1 overflow-x-auto border-b border-border">
    {tabs.map(([key, text, badge]) => (
      <button
        key={key}
        type="button"
        role="tab"
        aria-selected={current === key}
        onClick={(): void => onChange(key)}
        className={cn('-mb-px flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors', current === key ? 'border-brand text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground')}
      >
        {text}
        {badge !== undefined && badge > 0 && <span className="rounded-full bg-warning/14 px-1.5 text-xs font-semibold text-warning tabular-nums">{badge}</span>}
      </button>
    ))}
  </div>
);

export const Empty = ({ children }: { children: ReactNode }): JSX.Element => <p className="rounded-2xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">{children}</p>;
