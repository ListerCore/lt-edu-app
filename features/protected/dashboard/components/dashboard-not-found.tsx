import type { JSX } from 'react';
import Link from 'next/link';
import { ArrowRight, House, MoveRight } from 'lucide-react';
import type { DashboardNotFoundProps } from '../types';

const DashboardNotFound = ({ path }: DashboardNotFoundProps): JSX.Element => (
  <section className="relative isolate flex min-h-[calc(100svh-4.25rem)] w-full flex-col justify-center overflow-hidden px-4 py-10 sm:px-8 sm:py-12 lg:px-12" aria-labelledby="dashboard-not-found-title">
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-75 bg-[linear-gradient(to_right,color-mix(in_srgb,var(--border)_52%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_srgb,var(--border)_52%,transparent)_1px,transparent_1px)] bg-size-[28px_28px] mask-[linear-gradient(to_bottom,black_0%,black_74%,transparent_100%)]" />
    <div className="relative z-10 mx-auto w-full max-w-7xl">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
        404 <span className="px-2 text-secondary">/</span> Módulo no encontrado
      </p>
      <p aria-hidden="true" className="mt-7 select-none bg-[repeating-linear-gradient(125deg,var(--secondary)_0_1px,transparent_1px_8px)] bg-clip-text font-mono text-[clamp(8rem,27vw,21rem)] font-bold leading-[0.76] tracking-[-0.13em] text-transparent sm:mt-9">
        404
      </p>
      <div className="mt-9 grid gap-6 sm:mt-12 sm:grid-cols-[minmax(0,1fr)_minmax(16rem,0.72fr)] sm:items-end sm:gap-12">
        <div>
          <h1 id="dashboard-not-found-title" className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Este módulo no está disponible
          </h1>
        </div>
        <div className="max-w-lg">
          <p className="wrap-break-word text-sm leading-6 text-muted-foreground">
            {path ? (
              <>
                La ruta <code className="break-all font-mono text-foreground">{path}</code> no está habilitada o dejó de estar disponible.
              </>
            ) : (
              'La dirección solicitada no está disponible.'
            )}{' '}
            Puedes volver al panel principal para continuar.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            <Link href="/dashboard" className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90">
              <House aria-hidden="true" className="size-4" /> Volver al panel
            </Link>
            <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground underline decoration-secondary underline-offset-4 transition-colors hover:text-secondary">
              Ir al inicio <ArrowRight aria-hidden="true" className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="mt-12 flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.17em] text-muted-foreground/70 sm:mt-16">
        <span className="h-px w-12 bg-secondary/60" /> Ruta fuera del dashboard <MoveRight className="size-3.5 text-secondary" /> Panel principal
      </div>
    </div>
  </section>
);

export { DashboardNotFound };
