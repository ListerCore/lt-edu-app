'use client';

import type { JSX, ReactNode } from 'react';
import { Plus, X } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { weekdayLabels, weekdayShort } from '@/features/protected/academic/data/academic-data';
import { cn } from '@/lib/utils';
import type { ScheduleEntry, TimeBlock } from '../types';

// Every subject keeps its tone across the week, so the eye finds it again
const tones = ['border-l-brand bg-brand-soft', 'border-l-success bg-success/10', 'border-l-warning bg-warning/10', 'border-l-chart-2 bg-chart-2/12', 'border-l-chart-4 bg-chart-4/14', 'border-l-foreground/40 bg-secondary'];

export const toneFor = (key: string): string => {
  let h = 0;
  for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return tones[h % tones.length];
};

interface WeekGridProps {
  days: number[];
  blocks: TimeBlock[];
  entries: ScheduleEntry[];
  // What the card shows under the subject: the teacher (section view) or the section (teacher view)
  detail: (e: ScheduleEntry) => string;
  onEmpty?: (weekday: number, block: TimeBlock) => void;
  onRemove?: (e: ScheduleEntry) => void;
  // Slots taken elsewhere (the teacher's other classes): shown greyed
  busy?: (weekday: number, block: TimeBlock) => string | null;
  caption: string;
}

// The week as a table: class hours down, days across; breaks as thin rows
export const WeekGrid = ({ days, blocks, entries, detail, onEmpty, onRemove, busy, caption }: WeekGridProps): JSX.Element => {
  const at = new Map<string, ScheduleEntry[]>();
  for (const e of entries) {
    const key = `${e.weekday}|${e.blockId}`;
    at.set(key, [...(at.get(key) ?? []), e]);
  }
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-background">
      <table className="w-full min-w-[46rem] table-fixed border-collapse text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-border">
            <th scope="col" className="w-24 px-3 py-2.5 text-left text-xs font-medium text-muted-foreground">
              Hora
            </th>
            {days.map((d) => (
              <th key={d} scope="col" className="px-2 py-2.5 text-left text-xs font-semibold text-foreground">
                <span className="hidden sm:inline">{weekdayLabels[String(d)]}</span>
                <span className="sm:hidden">{weekdayShort[String(d)]}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {blocks.map((b) =>
            b.kind === 'break' ? (
              <tr key={b.id} className="border-b border-border bg-surface">
                <th scope="row" className="px-3 py-1 text-left text-[11px] font-normal text-muted-foreground tabular-nums">
                  {b.startsAt}
                </th>
                <td colSpan={days.length} className="px-2 py-1 text-[11px] text-muted-foreground">
                  Recreo
                </td>
              </tr>
            ) : (
              <tr key={b.id} className="border-b border-border last:border-0">
                <th scope="row" className="px-3 py-1.5 text-left align-top text-xs font-normal text-muted-foreground tabular-nums">
                  {b.startsAt}
                  <span className="block text-[11px] opacity-70">{b.endsAt}</span>
                </th>
                {days.map((d) => {
                  const here = at.get(`${d}|${b.id}`) ?? [];
                  const elsewhere = here.length === 0 ? busy?.(d, b) : null;
                  return (
                    <td key={d} className="h-16 p-1 align-top">
                      {here.length > 0 ? (
                        <div className="space-y-1">
                          {here.map((e) => (
                            <Cell key={e.id} entry={e} detail={detail(e)} onRemove={onRemove} />
                          ))}
                        </div>
                      ) : elsewhere ? (
                        <div className="flex h-full min-h-14 items-center rounded-md border border-dashed border-border px-2 text-[11px] text-muted-foreground">{elsewhere}</div>
                      ) : onEmpty ? (
                        <button type="button" onClick={(): void => onEmpty(d, b)} className="group flex h-full min-h-14 w-full items-center justify-center rounded-md border border-dashed border-transparent text-muted-foreground/0 transition-colors hover:border-brand/50 hover:text-brand" aria-label={`Agregar clase el ${weekdayLabels[String(d)]} a las ${b.startsAt}`}>
                          <MorphIcon icon={Plus} size={16} />
                        </button>
                      ) : null}
                    </td>
                  );
                })}
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
};

const Cell = ({ entry, detail, onRemove }: { entry: ScheduleEntry; detail: string; onRemove?: (e: ScheduleEntry) => void }): JSX.Element => (
  <div className={cn('group relative min-h-14 rounded-md border-l-4 px-2 py-1.5', toneFor(entry.subjectName))}>
    <p className="truncate pr-4 text-xs font-semibold text-foreground" title={entry.subjectName}>
      {entry.subjectName}
    </p>
    <p className="truncate text-[11px] text-muted-foreground" title={detail}>
      {detail}
    </p>
    {entry.room && <p className="truncate text-[11px] text-muted-foreground">{entry.room}</p>}
    {onRemove && (
      <button type="button" onClick={(): void => onRemove(entry)} className="absolute top-1 right-1 hidden size-5 items-center justify-center rounded text-muted-foreground hover:bg-background hover:text-destructive group-hover:flex" aria-label={`Quitar ${entry.subjectName}`}>
        <MorphIcon icon={X} size={12} />
      </button>
    )}
  </div>
);

// Blocks of the shifts some entries use, in time order (a teacher's week can span shifts)
export const blocksFor = (blocks: TimeBlock[], shifts: string[]): TimeBlock[] => blocks.filter((b) => shifts.includes(b.shift)).sort((a, b) => a.startsAt.localeCompare(b.startsAt));

export const EmptyNote = ({ children }: { children: ReactNode }): JSX.Element => <p className="rounded-xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">{children}</p>;
