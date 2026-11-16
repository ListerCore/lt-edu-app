'use client';

import type { JSX } from 'react';
import { cn } from '@/lib/utils';
import { shortDay } from '../data/participation-data';
import type { WeekStripProps } from '../types';

// One square per week: green when it met the rule, red when not, amber when the tutor adjusted it; the running week
// is outlined. With canAdjust a square opens the adjustment
export const WeekStrip = ({ student, canAdjust, onPick }: WeekStripProps): JSX.Element => (
  <div className="flex flex-wrap gap-0.5" role="list" aria-label={`Semanas de ${student.studentName}`}>
    {student.windows.map((w, i) => {
      const label = `Semana ${i + 1} (${shortDay(w.start)} – ${shortDay(w.end)}): ${w.activeDays} días con actividad${w.adjusted ? `, ajustada: ${w.present ? 'presente' : 'ausente'} (${w.reason})` : w.present ? ', cumple' : ', no cumple'}`;
      const cls = cn('size-3.5 rounded-[3px]', w.adjusted ? 'bg-warning' : w.present ? 'bg-success' : 'bg-destructive/60', i === student.windows.length - 1 && 'ring-1 ring-foreground/40 ring-offset-1 ring-offset-background');
      return canAdjust ? (
        <button key={w.start} type="button" role="listitem" title={label} aria-label={label} className={cn(cls, 'hover:scale-125 transition-transform')} onClick={(): void => onPick(w)} />
      ) : (
        <span key={w.start} role="listitem" title={label} aria-label={label} className={cls} />
      );
    })}
  </div>
);
