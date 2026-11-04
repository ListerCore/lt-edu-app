import type { JSX } from 'react';
import { revealDelay } from '@/lib/reveal';
import { siteConfig } from '@/lib/site';
import { cn } from '@/lib/utils';
import { landingContent } from '../data/landing-data';

const { offer } = landingContent[siteConfig.institutionType];

// Oferta educativa (full-height section of its navbar item): consecutive levels as a route (dot + line), independent cycles or programs as a ruled list
export const LandingPrograms = (): JSX.Element => (
  <section id="programs" aria-labelledby="programs-title" className="flex min-h-[calc(100svh-4rem)] scroll-mt-16 items-center bg-surface">
    <div className="mx-auto w-full max-w-6xl px-6 py-24 md:px-8">
      <div className="max-w-2xl">
        <h2 id="programs-title" data-reveal className="text-[clamp(2.25rem,4.5vw,3.5rem)] leading-tight font-semibold tracking-[-0.03em] text-balance text-foreground">
          Oferta educativa
        </h2>
        <p data-reveal style={revealDelay(90)} className="mt-4 text-lg leading-8 text-muted-foreground">
          {offer.intro}
        </p>
      </div>

      <ol className={cn('mt-16 grid gap-10 md:grid-cols-3 md:gap-8', !offer.sequential && 'list-none')}>
        {offer.items.map(({ name, range, description }, index): JSX.Element => (
          <li key={name} data-reveal style={revealDelay(160 + index * 160)} className="relative">
            {offer.sequential ? (
              <div aria-hidden="true" className="flex items-center">
                <span className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-solid text-sm font-semibold text-white tabular-nums">{index + 1}</span>
                {index < offer.items.length - 1 && <span data-reveal="line" style={revealDelay(420 + index * 160)} className="ml-3 hidden h-0.5 flex-1 bg-linear-to-r from-brand/60 to-brand/10 md:block" />}
              </div>
            ) : (
              <span aria-hidden="true" data-reveal="line" style={revealDelay(300 + index * 160)} className="block h-1 w-12 rounded-full bg-brand-solid" />
            )}
            <h3 className="mt-6 text-xl font-semibold tracking-tight text-foreground">{name}</h3>
            <p className="mt-1 text-sm font-medium text-brand">{range}</p>
            <p className="mt-3 max-w-xs text-base leading-7 text-muted-foreground">{description}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>
);
