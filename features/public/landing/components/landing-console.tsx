import type { CSSProperties, JSX } from 'react';
import { ScanLine } from 'lucide';
import { BrandMark } from '@/components/layout/brand-mark';
import { MorphIcon } from '@/components/ui/morph-icon';
import { cn } from '@/lib/utils';
import { heroCard, heroCheckIns, heroStats } from '../data/landing-data';
import { LandingIdCard } from './landing-id-card';

// Arrivals per 5 minutes between 7:00 and 8:00, the rush right before the bell
const arrivals = [4, 6, 9, 14, 22, 31, 46, 58, 64, 51, 27, 12];

const delay = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` });

// The panel's attendance screen at the gate: the ID card drops in, its QR is read and the student lands at the bottom of the log
export const LandingConsole = (): JSX.Element => {
  const last = heroCheckIns.length - 1;
  const peak = Math.max(...arrivals);

  return (
    <div className="relative xl:pl-54">
      <span aria-hidden="true" className="hero-glow" />

      <LandingIdCard card={heroCard} className="absolute top-[-2.5rem] left-0 z-10 hidden w-[15rem] xl:block" />

      <figure aria-label="Pantalla de asistencia del panel" className="relative overflow-hidden rounded-2xl border border-border bg-background shadow-[0_40px_90px_-40px_rgb(43_33_27/0.5)]">
        <header className="flex items-center gap-3 border-b border-border bg-surface px-5 py-3">
          <BrandMark className="size-6" />
          <p className="min-w-0 truncate text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Asistencia de estudiantes</span>
            <span className="hidden sm:inline"> · Mar 10 nov</span>
          </p>
          <span className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full whitespace-nowrap bg-success/12 px-2.5 py-0.5 text-xs font-medium text-success">
            <span aria-hidden="true" className="live-dot size-1.5 rounded-full bg-success" />
            En vivo
          </span>
        </header>

        <dl className="grid grid-cols-3 divide-x divide-border border-b border-border">
          {heroStats.map(({ label, value, detail }): JSX.Element => (
            <div key={label} className="px-5 py-4">
              <dt className="text-xs text-muted-foreground">{label}</dt>
              <dd className="mt-1 text-2xl font-semibold tracking-tight text-foreground tabular-nums">{value}</dd>
              <dd className="text-xs text-muted-foreground">{detail}</dd>
            </div>
          ))}
        </dl>

        <div className="border-b border-border px-5 pt-4 pb-3">
          <p className="text-xs text-muted-foreground">Ingresos de 7:00 a 8:00</p>
          <div aria-hidden="true" className="mt-3 flex h-16 items-end gap-1.5">
            {arrivals.map((count, index): JSX.Element => (
              <span key={index} className={cn('bar-grow flex-1 rounded-t-sm', index === 8 ? 'bg-brand-solid' : 'bg-brand/25')} style={{ height: `${(count / peak) * 100}%`, ...delay(300 + index * 45) }} />
            ))}
          </div>
          <div aria-hidden="true" className="mt-1.5 flex justify-between text-[11px] text-muted-foreground tabular-nums">
            <span>7:00</span>
            <span>7:30</span>
            <span>8:00</span>
          </div>
        </div>

        <div className="px-5 py-4">
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MorphIcon icon={ScanLine} size={13} />
            Puerta principal
          </p>
          <ol className="mt-2">
            {heroCheckIns.map(({ time, name, section, status }, index): JSX.Element => (
              <li key={name} style={index === last ? delay(1900) : undefined} className={cn('-mx-2 flex items-center gap-3 rounded-lg px-2 py-2 text-sm', index === last && 'checkin-flash')}>
                <span className="w-11 shrink-0 text-muted-foreground tabular-nums">{time}</span>
                <span className="min-w-0 flex-1 truncate font-medium text-foreground">{name}</span>
                <span className="hidden text-muted-foreground sm:inline">{section}</span>
                <span className={cn('pill', status === 'late' ? 'bg-warning/12 text-warning' : 'bg-success/12 text-success')}>{status === 'late' ? 'Tardanza' : 'A tiempo'}</span>
              </li>
            ))}
          </ol>
        </div>
      </figure>
    </div>
  );
};
