'use client';

import { useTransition, type JSX } from 'react';
import { Activity } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { runAcademicAction } from '@/features/protected/academic/hooks/use-academic-form';
import { cn } from '@/lib/utils';
import { checkUptimeAction } from '../actions/check-uptime';
import { formatInstant } from '../data/compliance-data';
import type { ComplianceBoard } from '../types';

// Availability of the platform URL: the summary of the last 30 days and the latest probes (sustento del hosting)
export const UptimeTab = ({ slug, board, onChange }: { slug: string; board: ComplianceBoard; onChange: () => void }): JSX.Element => {
  const [isPending, start] = useTransition();
  const up = board.uptime;
  const probe = (): void =>
    start(async () => {
      const r = await runAcademicAction(checkUptimeAction(slug));
      if (r.ok) onChange();
    });
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          URL registrada en la ficha de la plataforma: <span className="font-medium text-foreground">{board.platform?.url || 'sin registrar'}</span>
        </p>
        {board.canWrite && (
          <button type="button" className="btn-brand" disabled={isPending || !board.platform?.url} onClick={probe}>
            <MorphIcon icon={Activity} size={16} />
            {isPending ? 'Comprobando…' : 'Comprobar ahora'}
          </button>
        )}
      </div>
      <dl className="grid gap-3 sm:grid-cols-3">
        {[
          ['Disponibilidad (30 días)', up && up.checks > 0 ? `${up.percent.toFixed(1)} %` : '—'],
          ['Comprobaciones', String(up?.checks ?? 0)],
          ['Tiempo medio de respuesta', up && up.avgMs > 0 ? `${up.avgMs} ms` : '—'],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-border bg-background p-4">
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd className="mt-1 text-2xl font-semibold text-foreground tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
      {up?.recent.length ? (
        <ul className="divide-y divide-border rounded-2xl border border-border bg-background text-sm">
          {up.recent.map((c, i) => (
            <li key={`${c.checkedAt}-${i}`} className="flex flex-wrap items-center gap-3 px-4 py-2.5">
              <span className={cn('size-2.5 rounded-full', c.ok ? 'bg-success' : 'bg-destructive')} aria-hidden="true" />
              <span className="w-36 text-muted-foreground tabular-nums">{formatInstant(c.checkedAt)}</span>
              <span className="min-w-0 flex-1 truncate text-foreground">{c.ok ? `HTTP ${c.statusCode} · ${c.responseMs} ms` : c.error || `HTTP ${c.statusCode ?? '—'}`}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-2xl border border-dashed border-border px-6 py-8 text-center text-sm text-muted-foreground">Aún no hay comprobaciones. El monitor de la API las registra solo cuando está activo, o usa «Comprobar ahora».</p>
      )}
      <p className="text-xs text-muted-foreground">El resumen sale en el apartado IV del informe de la plataforma como fecha y método de comprobación del alojamiento.</p>
    </div>
  );
};
