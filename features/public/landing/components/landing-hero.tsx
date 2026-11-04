import Link from 'next/link';
import type { JSX } from 'react';
import { ClipboardList, Megaphone } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { revealDelay } from '@/lib/reveal';
import { siteConfig } from '@/lib/site';
import { landingContent } from '../data/landing-data';
import { LandingIdCard } from './landing-id-card';

const content = landingContent[siteConfig.institutionType];

// Hero: what the institution offers, the two main actions and the student ID card as the visual anchor
export const LandingHero = (): JSX.Element => (
  <section aria-labelledby="hero-title" className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-6xl content-center items-center gap-12 px-6 py-16 md:px-8 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
    <div>
      <h1 id="hero-title" data-reveal className="max-w-xl text-[clamp(2.5rem,6vw,4.25rem)] leading-[1.02] font-semibold tracking-[-0.035em] text-balance text-foreground">
        Una comunidad que te acompaña en cada etapa.
      </h1>
      <p data-reveal style={revealDelay(90)} className="mt-6 max-w-lg text-lg leading-8 text-muted-foreground">
        {content.heroLead}
      </p>
      <div data-reveal style={revealDelay(180)} className="mt-9 flex flex-wrap gap-3">
        <Link href="/#admissions" className="btn-brand h-11 px-6">
          <MorphIcon icon={ClipboardList} size={16} />
          Iniciar admisión
        </Link>
        <Link href="/news" className="btn-alt h-11 px-6">
          <MorphIcon icon={Megaphone} size={16} />
          Ver comunicados
        </Link>
      </div>
      <p data-reveal style={revealDelay(260)} className="mt-6 text-sm text-muted-foreground">
        ¿Ya estudias aquí?{' '}
        <Link href="/auth/signin" className="font-medium text-foreground underline decoration-brand/40 underline-offset-4 transition-colors hover:text-brand hover:decoration-brand">
          Ingresa a tu cuenta
        </Link>
      </p>
    </div>
    <LandingIdCard card={content.idCard} />
  </section>
);
