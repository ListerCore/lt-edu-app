import type { JSX } from 'react';
import Image from 'next/image';
import { ArrowRight, HeartHandshake } from 'lucide-react';
import { enrollmentSteps } from './landing-data';

const AdmissionsSection = (): JSX.Element => (
  <section id="admissions" className="scroll-mt-24 rounded-2xl bg-muted/60 px-4 py-14 sm:px-7 sm:py-16" aria-labelledby="admissions-title">
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-secondary">Proceso simple</p>
      <h2 id="admissions-title" className="mt-2 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        ¿Cómo empiezo?
      </h2>
      <p className="mt-3 text-xs leading-5 text-muted-foreground sm:text-sm">Da el primer paso y recibe orientación personalizada para continuar tus estudios.</p>
    </div>
    <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {enrollmentSteps.map(({ title, description, icon: Icon }, index) => (
        <article key={title} className="relative rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="grid size-9 place-items-center rounded-lg bg-secondary/10 text-secondary">
              <Icon className="size-4" />
            </span>
            <span className="text-xs font-bold text-muted-foreground/60">0{index + 1}</span>
          </div>
          <h3 className="mt-3 text-xs font-bold text-foreground">{title}</h3>
          <p className="mt-1.5 text-[10px] leading-5 text-muted-foreground">{description}</p>
        </article>
      ))}
    </div>
    <div className="mt-5 grid gap-4 rounded-2xl border border-border bg-card p-4 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-center">
      <div className="flex gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <HeartHandshake className="size-5" />
        </span>
        <div>
          <h3 className="text-sm font-bold text-foreground">Estamos aquí para orientarte</h3>
          <p className="mt-1 max-w-xl text-[10px] leading-5 text-muted-foreground">Cuéntanos sobre tus estudios anteriores y resolveremos tus dudas para que sepas cómo continuar.</p>
        </div>
      </div>
      <a className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-primary px-4 text-[10px] font-semibold text-primary-foreground transition-colors hover:bg-primary/85" href="https://wa.me/51966845120?text=Hola%2C%20deseo%20informaci%C3%B3n%20sobre%20la%20matr%C3%ADcula%20en%20el%20CEBA%20Joseph%20Lister" target="_blank" rel="noreferrer">
        <Image src="/icons/whatsapp-icon.svg" alt="" width={14} height={14} className="size-3.5" /> Solicitar orientación <ArrowRight aria-hidden="true" className="size-3.5" />
      </a>
    </div>
  </section>
);

export { AdmissionsSection };
