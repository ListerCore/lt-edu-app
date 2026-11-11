import type { JSX } from 'react';
import { Check } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { revealDelay } from '@/lib/reveal';
import { roleAccess } from '../data/landing-data';

// Para quién: what each role finds when it signs in, on a ruled grid instead of cards
export const LandingRoles = (): JSX.Element => (
  <section id="roles" aria-labelledby="roles-title" className="scroll-mt-16 border-t border-border">
    <div className="mx-auto max-w-7xl px-6 py-24 md:px-8 md:py-32">
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
        <h2 id="roles-title" data-reveal className="text-[clamp(2.1rem,4.2vw,3.25rem)] leading-tight font-semibold tracking-[-0.03em] text-balance text-foreground">
          Cada persona entra a lo que le corresponde
        </h2>
        <p data-reveal style={revealDelay(90)} className="max-w-lg text-lg leading-8 text-muted-foreground lg:justify-self-end">
          Un solo acceso con su correo. El panel cambia según el rol: la directora ve la institución entera, el docente solo sus secciones y la familia solo a sus hijos.
        </p>
      </div>

      <ul className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {roleAccess.map(({ icon, title, description, items }, index): JSX.Element => (
          <li key={title} data-reveal style={revealDelay(120 + (index % 3) * 100)} className="bg-background p-7 lg:p-8">
            <span className="flex size-11 items-center justify-center rounded-full bg-brand-soft text-brand">
              <MorphIcon icon={icon} size={20} />
            </span>
            <h3 className="mt-5 text-xl font-semibold tracking-tight text-foreground">{title}</h3>
            <p className="mt-1 text-base text-muted-foreground">{description}</p>
            <ul className="mt-5 space-y-2.5">
              {items.map((item): JSX.Element => (
                <li key={item} className="flex items-start gap-3 text-sm leading-6 text-foreground/85">
                  <MorphIcon icon={Check} size={15} strokeWidth={2.5} className="mt-1 shrink-0 text-success" />
                  {item}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  </section>
);
