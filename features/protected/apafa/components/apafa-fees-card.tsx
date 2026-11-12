'use client';

import type { JSX } from 'react';
import { Wallet } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import type { FeesCardProps } from '../types';

// Read-only summary of the APAFA fee (finance concept apafa) of the running periods
export const ApafaFeesCard = ({ fees }: FeesCardProps): JSX.Element => (
  <section aria-labelledby="apafa-fees-title" className="rounded-2xl border border-border bg-background p-5">
    <header className="flex items-center gap-3">
      <span className="flex size-9 items-center justify-center rounded-lg bg-brand-soft text-brand" aria-hidden="true">
        <MorphIcon icon={Wallet} size={16} />
      </span>
      <div>
        <h2 id="apafa-fees-title" className="text-base font-semibold text-foreground">
          Cuota APAFA
        </h2>
        <p className="text-xs text-muted-foreground">Periodos en curso · se cobra en Pagos</p>
      </div>
    </header>
    {fees.charged === 0 ? (
      <p className="mt-4 text-sm text-muted-foreground">Aún no hay cuotas APAFA generadas. Agrégalas al plan de pagos del periodo.</p>
    ) : (
      <>
        <p className="mt-4 text-3xl font-semibold tracking-tight text-foreground tabular-nums">{fees.collected}</p>
        <p className="text-sm text-muted-foreground">
          recaudado de <span className="tabular-nums">{fees.expected}</span>
        </p>
        <span className="mt-3 block h-2 overflow-hidden rounded-full bg-secondary" role="progressbar" aria-valuenow={fees.percent} aria-valuemin={0} aria-valuemax={100} aria-label="Avance de la recaudación">
          <span className="block h-full rounded-full bg-success" style={{ width: `${fees.percent}%` }} />
        </span>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-xs text-muted-foreground">Familias al día</dt>
            <dd className="font-semibold text-foreground tabular-nums">
              {fees.settled} de {fees.charged}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Por cobrar</dt>
            <dd className="font-semibold text-foreground tabular-nums">{fees.pending}</dd>
          </div>
        </dl>
      </>
    )}
  </section>
);
