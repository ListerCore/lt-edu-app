import type { JSX } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { programs } from './landing-data';

const ProgramsSection = (): JSX.Element => (
  <section id="programs" className="scroll-mt-24 rounded-2xl bg-muted/60 px-4 py-14 sm:px-7 sm:py-16" aria-labelledby="programs-title">
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-secondary">Tu ruta educativa</p>
      <h2 id="programs-title" className="mt-2 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        Ciclos y grados formativos
      </h2>
      <p className="mt-3 text-xs leading-5 text-muted-foreground sm:text-sm">Conoce las etapas de Educación Básica Alternativa y encuentra el punto de partida adecuado para ti.</p>
    </div>
    <div className="mt-8 grid gap-3 lg:grid-cols-3">
      {programs.map(({ cycle, grades, description, duration, icon: Icon, color }, index) => (
        <article key={cycle} className={`flex flex-col rounded-xl border bg-card p-4 sm:p-5 ${index === 2 ? 'border-secondary/40 shadow-sm' : 'border-border'}`}>
          <div className="flex items-start justify-between gap-3">
            <span className={`grid size-10 place-items-center rounded-xl bg-muted ${color}`}>
              <Icon className="size-5" />
            </span>
            {index === 2 && <span className="rounded-full bg-secondary/10 px-2.5 py-1 text-[9px] font-bold text-secondary">Culmina secundaria</span>}
          </div>
          <p className="mt-4 text-[9px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{grades}</p>
          <h3 className="mt-1 text-base font-bold text-foreground">{cycle}</h3>
          <p className="mt-2 min-h-10 text-[11px] leading-5 text-muted-foreground">{description}</p>
          <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-[10px]">
            <span className="text-muted-foreground">Duración referencial</span>
            <span className="font-semibold text-foreground">{duration}</span>
          </div>
          <Link href="#admissions" className="mt-3 inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg bg-muted text-[10px] font-semibold text-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground">
            Consultar requisitos <ArrowRight className="size-3.5" />
          </Link>
        </article>
      ))}
    </div>
    <p className="mt-4 text-center text-[9px] leading-4 text-muted-foreground">La ubicación en el ciclo se confirma revisando tus estudios anteriores con el equipo de admisión.</p>
  </section>
);

export { ProgramsSection };
