import type { JSX } from 'react';
import { MorphIcon } from '@/components/ui/morph-icon';
import { revealDelay } from '@/lib/reveal';
import { securityPoints } from '../data/landing-data';

// Seguridad: the statement on one side, the four guarantees on the other
export const LandingSecurity = (): JSX.Element => (
  <section id="security" aria-labelledby="security-title" className="scroll-mt-16 border-t border-border">
    <div className="mx-auto grid max-w-7xl gap-14 px-6 py-24 md:px-8 md:py-32 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
      <div>
        <h2 id="security-title" data-reveal="left" className="text-[clamp(2.1rem,4.2vw,3.25rem)] leading-tight font-semibold tracking-[-0.03em] text-balance text-foreground">
          Los datos de tus estudiantes, protegidos
        </h2>
        <p data-reveal="left" style={revealDelay(90)} className="mt-4 max-w-md text-lg leading-8 text-muted-foreground">
          Notas, pagos y fichas de menores de edad merecen más que una contraseña compartida en secretaría.
        </p>
      </div>
      <ul className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
        {securityPoints.map(({ icon, title, description }, index): JSX.Element => (
          <li key={title} data-reveal="right" style={revealDelay(140 + index * 90)}>
            <span className="flex size-11 items-center justify-center rounded-lg bg-secondary text-foreground">
              <MorphIcon icon={icon} size={20} />
            </span>
            <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
            <p className="mt-2 text-base leading-7 text-muted-foreground">{description}</p>
          </li>
        ))}
      </ul>
    </div>
  </section>
);
