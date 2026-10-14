import type { JSX } from 'react';
import { LoaderCircle } from 'lucide-react';

const LoadingPage = (): JSX.Element => (
  <section role="status" aria-busy="true" aria-label="Cargando página" className="mx-auto flex min-h-[68svh] max-w-4xl flex-col justify-center py-14">
    <div className="flex items-center gap-3 text-primary">
      <LoaderCircle aria-hidden="true" className="size-5 animate-spin motion-reduce:animate-none" />
      <p className="font-heading text-sm font-semibold">Preparando la página</p>
    </div>
    <div aria-hidden="true" className="mt-7 space-y-4">
      <div className="h-7 w-2/3 animate-pulse rounded-md bg-muted sm:w-1/2" />
      <div className="h-4 w-full max-w-2xl animate-pulse rounded-md bg-muted" />
      <div className="h-4 w-5/6 max-w-xl animate-pulse rounded-md bg-muted" />
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <div className="h-28 animate-pulse rounded-xl border border-border bg-card" />
        <div className="h-28 animate-pulse rounded-xl border border-border bg-card" />
        <div className="h-28 animate-pulse rounded-xl border border-border bg-card" />
      </div>
    </div>
  </section>
);

export { LoadingPage };
