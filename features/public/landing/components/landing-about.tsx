import type { JSX } from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

const AboutSection = (): JSX.Element => (
  <section id="about-us" className="scroll-mt-24 py-16 sm:py-20" aria-labelledby="about-title">
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-secondary">Nuestra institución</p>
      <h2 id="about-title" className="mt-2 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        Pioneros en educación flexible en Ayacucho
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-xs leading-6 text-muted-foreground sm:text-sm">En CEBA Privado Virtual Joseph Lister creemos que siempre es posible continuar. Te acompañamos a desarrollar tus competencias y alcanzar tus metas educativas.</p>
    </div>
    <div className="mt-8 grid gap-4 md:grid-cols-2">
      {[
        { title: 'Nuestra misión', text: 'Brindar una educación básica alternativa accesible, cercana y de calidad, que permita a jóvenes y adultos construir nuevas oportunidades.', icon: ShieldCheck },
        { title: 'Nuestra visión', text: 'Ser una comunidad educativa que inspira a las personas a aprender, avanzar y transformar su futuro con confianza.', icon: Sparkles },
      ].map(({ title, text, icon: Icon }) => (
        <article key={title} className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <span className="grid size-10 place-items-center rounded-xl bg-secondary/10 text-secondary">
            <Icon className="size-5" />
          </span>
          <h3 className="mt-4 text-sm font-bold text-foreground">{title}</h3>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">{text}</p>
        </article>
      ))}
    </div>
    <div className="mt-4 flex flex-col gap-4 rounded-2xl bg-primary p-5 text-primary-foreground sm:flex-row sm:items-center sm:justify-between sm:px-7">
      <div className="flex items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/10">
          <ShieldCheck className="size-5" />
        </span>
        <div>
          <p className="text-xs font-bold">Tu educación merece confianza</p>
          <p className="mt-1 text-[10px] leading-4 text-primary-foreground/75">Conoce los requisitos y recibe orientación sobre tu proceso de matrícula.</p>
        </div>
      </div>
      <Link href="#admissions" className="inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-secondary px-3 text-[10px] font-semibold text-secondary-foreground transition-colors hover:bg-secondary/85">
        Hablar con admisión <ArrowRight aria-hidden="true" className="size-3.5" />
      </Link>
    </div>
  </section>
);

export { AboutSection };
