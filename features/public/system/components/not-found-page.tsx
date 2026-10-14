import type { JSX } from 'react';
import Link from 'next/link';
import { ArrowRight, House, MoveRight } from 'lucide-react';
import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { ActiveNavigationProvider } from '@/components/layout/active-navigation';

const NotFoundPage = (): JSX.Element => (
  <ActiveNavigationProvider>
    <Navbar />
    <main className="relative isolate flex min-h-svh w-full flex-col justify-center overflow-hidden px-4 pb-16 pt-24 sm:px-8 lg:px-12">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-75 bg-[linear-gradient(to_right,color-mix(in_srgb,var(--border)_52%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_srgb,var(--border)_52%,transparent)_1px,transparent_1px)] bg-size-[28px_28px] mask-[linear-gradient(to_bottom,black_0%,black_74%,transparent_100%)]" />
      <section className="relative z-10 mx-auto w-full max-w-7xl" aria-labelledby="not-found-title">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          404 <span className="px-2 text-secondary">/</span> Dirección no encontrada
        </p>
        <p aria-hidden="true" className="mt-7 select-none bg-[repeating-linear-gradient(125deg,var(--secondary)_0_1px,transparent_1px_8px)] bg-clip-text font-mono text-[clamp(9rem,31vw,24rem)] font-bold leading-[0.76] tracking-[-0.13em] text-transparent sm:mt-9">
          404
        </p>
        <div className="mt-9 grid gap-6 sm:mt-12 sm:grid-cols-[minmax(0,1fr)_minmax(16rem,0.72fr)] sm:items-end sm:gap-12">
          <div>
            <h1 id="not-found-title" className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Esta dirección no lleva a ninguna página
            </h1>
          </div>
          <div className="max-w-lg">
            <p className="text-sm leading-6 text-muted-foreground">La página pudo cambiar de dirección o dejar de estar disponible. Puedes volver al inicio o explorar el sitio institucional.</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link href="/" className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90">
                <House aria-hidden="true" className="size-4" /> Volver al inicio
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground underline decoration-secondary underline-offset-4 transition-colors hover:text-secondary">
                Ir a contacto <ArrowRight aria-hidden="true" className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
        <div aria-hidden="true" className="mt-12 flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.17em] text-muted-foreground/70 sm:mt-16">
          <span className="h-px w-12 bg-secondary/60" /> Dirección fuera de ruta <MoveRight className="size-3.5 text-secondary" /> Inicio
        </div>
      </section>
    </main>
    <div className="relative z-10">
      <Footer />
    </div>
  </ActiveNavigationProvider>
);

export { NotFoundPage };
