import type { JSX } from 'react';
import { BookOpenCheck, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { HelpCenterTab } from '../types';

const searchSuggestions = ['Iniciar sesión', 'Entregar tareas', 'Exámenes en línea', 'Descargar certificados', 'Horarios de clase', 'Recuperar contraseña'];

type HelpHeroProps = { query: string; updateQuery: (query: string) => void; selectTab: (tab: HelpCenterTab) => void };

const HelpHero = ({ query, updateQuery, selectTab }: HelpHeroProps): JSX.Element => (
  <section className="overflow-hidden rounded-2xl border border-primary/10 bg-[linear-gradient(110deg,color-mix(in_oklab,var(--primary)_11%,var(--card)),var(--card)_50%,color-mix(in_oklab,var(--secondary)_14%,var(--card)))] p-5 sm:p-8 lg:p-10" aria-labelledby="help-center-title">
    <div className="max-w-3xl">
      <div className="inline-flex items-center gap-2 rounded-md border border-border/70 bg-background/70 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-primary">
        <BookOpenCheck aria-hidden="true" className="size-3.5" /> Base de conocimiento y aprendizaje digital
      </div>
      <h1 id="help-center-title" className="mt-4 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
        Centro de Tutoriales y Novedades
      </h1>
      <p className="mt-2 max-w-2xl text-xs leading-5 text-muted-foreground sm:text-sm">Encuentra guías para usar el aula virtual, videos paso a paso y comunicados de la institución.</p>
    </div>

    <div className="mt-6 max-w-4xl">
      <div className="flex flex-col gap-2 rounded-xl border border-border/80 bg-background p-2 shadow-sm sm:flex-row">
        <label htmlFor="help-search" className="sr-only">
          Buscar tutoriales, guías o anuncios
        </label>
        <div className="relative flex-1">
          <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input id="help-search" value={query} onChange={(event: React.ChangeEvent<HTMLInputElement>): void => updateQuery(event.currentTarget.value)} placeholder="¿Qué necesitas aprender? Busca una tarea, calificación o pago" className="h-11 border-0 bg-transparent pl-9 text-xs shadow-none focus-visible:ring-0" />
        </div>
        <Button type="button" onClick={(): void => selectTab('all')} className="h-10 gap-2 rounded-lg px-5 text-xs font-semibold">
          <Search aria-hidden="true" className="size-3.5" /> Buscar
        </Button>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[9px]">
        <span className="mr-1 font-semibold text-muted-foreground">Búsquedas frecuentes:</span>
        {searchSuggestions.map((suggestion): JSX.Element => (
          <button
            key={suggestion}
            type="button"
            onClick={(): void => {
              updateQuery(suggestion);
              selectTab('all');
            }}
            className="rounded-md border border-border bg-background/70 px-2 py-1 text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  </section>
);

export { HelpHero };
