import type { JSX } from 'react';
import { cn } from '@/lib/utils';
import { daysBetween, formatDay } from '../data/academic-data';
import type { Period } from '../types';

interface PeriodTimelineProps {
  period: Period;
  today: string;
  size?: 'sm' | 'lg';
}

// The period as a bar from start to end: its terms where they fall, the breaks between them, and today
export const PeriodTimeline = ({ period, today, size = 'sm' }: PeriodTimelineProps): JSX.Element => {
  const total = Math.max(1, daysBetween(period.startsOn, period.endsOn));
  const offset = (day: string): number => ((daysBetween(period.startsOn, day) - 1) / total) * 100;
  const width = (from: string, to: string): number => (daysBetween(from, to) / total) * 100;
  const inside = today !== '' && today >= period.startsOn && today <= period.endsOn;
  const terms = period.terms.length > 0 ? period.terms : [{ id: 'whole', number: 1, name: period.name, startsOn: period.startsOn, endsOn: period.endsOn, status: period.status === 'closed' ? 'closed' : 'open' }];
  const large = size === 'lg';

  return (
    <div className={cn(large && 'pb-6')}>
      {large && (
        <div className="relative mb-1.5 h-4 text-xs font-semibold text-foreground">
          {inside && (
            <span className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: `${Math.min(96, Math.max(4, offset(today)))}%` }}>
              Hoy
            </span>
          )}
        </div>
      )}
      <div aria-hidden="true" className={cn('relative w-full overflow-hidden rounded-full bg-[repeating-linear-gradient(135deg,var(--border)_0_4px,transparent_4px_8px)]', large ? 'h-10 rounded-xl' : 'h-2')}>
        {terms.map((term) => {
          const past = today !== '' && term.endsOn < today;
          const current = today !== '' && term.startsOn <= today && today <= term.endsOn;
          return (
            <div key={term.id} className="absolute inset-y-0 border-x border-background bg-background" style={{ left: `${offset(term.startsOn)}%`, width: `${width(term.startsOn, term.endsOn)}%` }}>
              <div className={cn('flex h-full items-center overflow-hidden', current ? 'bg-brand-solid text-white' : past || term.status === 'closed' ? 'bg-brand/35 text-foreground' : 'bg-brand/15 text-foreground', large && 'px-3')}>
                {large && <span className="truncate text-xs font-semibold">{term.name}</span>}
              </div>
            </div>
          );
        })}
        {inside && <span className={cn('absolute inset-y-0 w-0.5 bg-foreground', large && 'w-[3px]')} style={{ left: `${offset(today)}%` }} />}
      </div>
      {large && (
        <div className="relative mt-2 h-4 text-xs text-muted-foreground">
          <span className="absolute left-0">{formatDay(period.startsOn)}</span>
          <span className="absolute right-0">{formatDay(period.endsOn)}</span>
        </div>
      )}
    </div>
  );
};
