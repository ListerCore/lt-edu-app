import Image from 'next/image';
import Link from 'next/link';
import type { JSX } from 'react';
import { CircleHelp, Clock3, GraduationCap, Mail, Search, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { onboardingSteps } from './help-data';

const HelpOnboardingSection = (): JSX.Element => (
  <section className="space-y-4" aria-labelledby="onboarding-title">
    <div className="max-w-2xl">
      <p className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-secondary">
        <GraduationCap aria-hidden="true" className="size-3.5" /> Ruta de inicio
      </p>
      <h2 id="onboarding-title" className="mt-1 font-heading text-lg font-bold tracking-tight text-foreground sm:text-xl">
        Primeros pasos en el aula virtual
      </h2>
      <p className="mt-1 text-[10px] leading-5 text-muted-foreground">Sigue esta ruta para familiarizarte con el campus virtual durante tu primera semana.</p>
    </div>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {onboardingSteps.map(({ title, description, icon: Icon, timing }, index): JSX.Element => (
        <Card key={title} className="py-0">
          <CardContent className="flex h-full flex-col p-4">
            <div className="flex items-center justify-between">
              <span className={`grid size-9 place-items-center rounded-full text-xs font-bold ${index === onboardingSteps.length - 1 ? 'bg-secondary text-secondary-foreground' : 'bg-primary text-primary-foreground'}`}>{index + 1}</span>
              <span className="text-[9px] font-semibold text-muted-foreground">{timing}</span>
            </div>
            <span className="mt-4 grid size-8 place-items-center rounded-lg bg-secondary/10 text-secondary">
              <Icon aria-hidden="true" className="size-4" />
            </span>
            <h3 className="mt-3 font-heading text-xs font-bold leading-5 text-foreground">{title}</h3>
            <p className="mt-1.5 flex-1 text-[9px] leading-4 text-muted-foreground">{description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  </section>
);

const HelpSupportSection = (): JSX.Element => (
  <section className="relative overflow-hidden rounded-2xl border border-secondary/15 bg-[linear-gradient(110deg,color-mix(in_oklab,var(--primary)_9%,var(--card)),color-mix(in_oklab,var(--secondary)_11%,var(--card)))] p-5 sm:p-7 lg:flex lg:items-center lg:justify-between lg:gap-8" aria-labelledby="help-support-title">
    <div className="max-w-2xl">
      <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary/10 px-2.5 py-1.5 text-[9px] font-semibold text-secondary">
        <CircleHelp aria-hidden="true" className="size-3.5" /> Mesa de ayuda integral
      </span>
      <h2 id="help-support-title" className="mt-3 font-heading text-lg font-bold tracking-tight text-foreground sm:text-xl">
        ¿Aún necesitas ayuda con la plataforma?
      </h2>
      <p className="mt-2 text-[10px] leading-5 text-muted-foreground sm:text-xs">El equipo institucional puede orientarte con el acceso al aula virtual, los recursos de estudio y tus consultas académicas.</p>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[9px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Clock3 aria-hidden="true" className="size-3.5 text-secondary" /> Atención por los canales institucionales
        </span>
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck aria-hidden="true" className="size-3.5 text-secondary" /> Atención segura y personalizada
        </span>
      </div>
    </div>
    <div className="mt-5 flex flex-col gap-2 sm:flex-row lg:mt-0 lg:shrink-0 lg:flex-col">
      <a href="https://wa.me/51966845120?text=Hola%2C%20necesito%20ayuda%20con%20el%20aula%20virtual%20de%20CEBA%20Joseph%20Lister" target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-secondary px-4 text-[10px] font-semibold text-secondary-foreground transition-opacity hover:opacity-90">
        <Image src="/icons/whatsapp-icon.svg" alt="" width={16} height={16} className="size-4" /> Escribir por WhatsApp a soporte
      </a>
      <Link href="/contact" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-border bg-background/80 px-4 text-[10px] font-semibold text-foreground transition-colors hover:bg-accent">
        <Mail aria-hidden="true" className="size-3.5 text-primary" /> Ir al formulario de contacto
      </Link>
    </div>
  </section>
);

const EmptyResults = (): JSX.Element => (
  <div className="rounded-xl border border-dashed border-border bg-card/60 px-5 py-10 text-center">
    <Search aria-hidden="true" className="mx-auto size-5 text-muted-foreground" />
    <p className="mt-3 text-xs font-semibold text-foreground">No encontramos resultados</p>
    <p className="mt-1 text-[10px] text-muted-foreground">Prueba con otra palabra o elige un tema diferente.</p>
  </div>
);

export { HelpOnboardingSection, HelpSupportSection, EmptyResults };
