import type { JSX } from 'react';
import type { LegalPageProps } from '../types';

// Documentation-style frame for legal documents: sidebar index, header and body
export const LegalPage = ({ code, eyebrow, title, highlight, summary, updatedAt, sections, children }: LegalPageProps): JSX.Element => (
  <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-12 md:px-8 md:py-16 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
    <nav aria-label="Índice" className="lg:border-r lg:border-border lg:pr-8">
      <div className="lg:sticky lg:top-32">
        <p className="text-sm font-semibold text-foreground">Índice</p>
        <ol className="mt-3 space-y-0.5 border-l border-border">
          {sections.map((section): JSX.Element => (
            <li key={section.id}>
              <a href={`#${section.id}`} className="-ml-px block border-l border-transparent py-1.5 pl-4 text-sm text-muted-foreground transition-colors hover:border-brand hover:text-brand">
                {section.title}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>

    <div className="min-w-0 max-w-3xl">
      <header className="border-b border-border pb-10">
        <p className="pill bg-brand-soft text-brand">
          <span className="font-mono text-[11px] opacity-70">{code}</span>
          {eyebrow}
        </p>
        <h1 className="mt-5 text-[clamp(2rem,4.5vw,2.75rem)] leading-tight font-bold tracking-tight text-balance text-foreground">
          {title} <span className="text-gradient">{highlight}</span>
        </h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground md:text-lg">{summary}</p>
        <p className="mt-5 text-sm text-muted-foreground">Última actualización · {updatedAt}</p>
      </header>
      <div className="pt-10">{children}</div>
    </div>
  </div>
);
