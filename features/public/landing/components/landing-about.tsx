import type { JSX } from 'react';
import { MorphIcon } from '@/components/ui/morph-icon';
import { revealDelay } from '@/lib/reveal';
import { aboutStatement, aboutValues } from '../data/landing-data';

// Nosotros (full-height section of its navbar item): the commitment as a large statement and what families can count on
export const LandingAbout = (): JSX.Element => (
  <section id="about" aria-labelledby="about-title" className="flex min-h-[calc(100svh-4rem)] scroll-mt-16 items-center border-t border-border">
    <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 py-24 md:px-8 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
      <div>
        <h2 id="about-title" data-reveal="left" className="text-[clamp(2.25rem,4.5vw,3.5rem)] leading-tight font-semibold tracking-[-0.03em] text-balance text-foreground">
          Nosotros
        </h2>
        <p data-reveal="left" style={revealDelay(100)} className="mt-6 max-w-xl text-[clamp(1.35rem,2.4vw,1.85rem)] leading-[1.35] font-normal tracking-[-0.01em] text-balance text-foreground/85">{aboutStatement}</p>
      </div>
      <ul className="flex flex-col divide-y divide-border">
        {aboutValues.map(({ icon, title, description }, index): JSX.Element => (
          <li key={title} data-reveal="right" style={revealDelay(150 + index * 110)} className="flex gap-4 py-6 first:pt-0 last:pb-0">
            <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
              <MorphIcon icon={icon} size={18} />
            </span>
            <div>
              <h3 className="font-semibold text-foreground">{title}</h3>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </section>
);
