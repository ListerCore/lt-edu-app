import Link from 'next/link';
import type { JSX } from 'react';
import { BadgeCheck, ChevronRight, FileText, Home } from 'lucide-react';
import type { LegalPageProps } from '../types';

const LegalPage = ({ eyebrow, title, summary, tags = [], sections = [], icon: PageIcon, children }: LegalPageProps): JSX.Element => (
  <div className="mx-auto max-w-7xl py-8 sm:py-10">
    <nav aria-label="Ruta de navegación" className="mb-5 flex items-center gap-2 text-xs text-muted-foreground">
      <Link href="/" className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground">
        <Home aria-hidden="true" className="size-3.5" /> Inicio
      </Link>
      <ChevronRight aria-hidden="true" className="size-3.5" />
      <span>Transparencia y Legal</span>
      <ChevronRight aria-hidden="true" className="size-3.5" />
      <span className="truncate text-foreground">{title}</span>
    </nav>
    <header className="mb-8 border-b border-border pb-7">
      <div className="mb-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-semibold text-secondary">
            <BadgeCheck aria-hidden="true" className="size-3.5" />
            {tag}
          </span>
        ))}
      </div>
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div className="max-w-4xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-secondary">{eyebrow}</p>
          <div className="flex items-center gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-secondary/25 bg-secondary/10 text-secondary">{PageIcon ? <PageIcon aria-hidden="true" className="size-5" /> : <FileText aria-hidden="true" className="size-5" />}</span>
            <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
          </div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{summary}</p>
          <p className="mt-3 text-xs text-muted-foreground">
            Última actualización: 14 de octubre de 2026 <span className="px-1">·</span> CEBA Joseph Lister
          </p>
        </div>
      </div>
    </header>
    <div className={`grid gap-6 ${sections.length > 0 ? 'lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)]' : 'grid-cols-1'}`}>
      {sections.length > 0 && (
        <aside className="h-fit rounded-xl border border-border bg-card p-4 lg:sticky lg:top-24 print:hidden">
          <h2 className="font-heading text-sm font-semibold">Índice del documento</h2>
          <nav className="mt-3 grid max-h-[65vh] gap-1 overflow-y-auto">
            {sections.map((section, index) => (
              <a key={section.id} href={`#${section.id}`} className="flex items-start gap-2 rounded-md px-2.5 py-2 text-xs leading-5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                <FileText aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-secondary" />
                <span>
                  <span className="mr-1.5 font-semibold text-secondary">{String(index + 1).padStart(2, '0')}</span>
                  {section.title}
                </span>
              </a>
            ))}
          </nav>
        </aside>
      )}
      <div className="min-w-0 space-y-5 [&>section]:rounded-xl [&>section]:border [&>section]:border-border [&>section]:bg-card [&>section]:p-5 sm:[&>section]:p-6">{children}</div>
    </div>
  </div>
);

export { LegalPage };
