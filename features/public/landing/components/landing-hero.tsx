import Image from 'next/image';
import Link from 'next/link';
import type { JSX } from 'react';
import { LogIn, Send } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { revealDelay } from '@/lib/reveal';
import { heroFacts, supportedInstitutions } from '../data/landing-data';

// Hero: the campus photo covers the whole first screen (behind the translucent navbar too); the text
// sits low on the left over a subtle theme-colored wash, so it reads in both themes and the building's sign stays in view;
// the headline takes the brand color
export const LandingHero = (): JSX.Element => (
  <section aria-labelledby="hero-title" className="relative isolate -mt-16 flex min-h-svh flex-col overflow-hidden">
    {/* Campus backdrop with a light wash from --background (white in light mode, dark in dark mode) rising from the
        bottom left where the text sits; the sign on the upper right stays clear */}
    <div aria-hidden="true" className="absolute inset-0 -z-1">
      <Image src="/campus.jpg" alt="" fill priority sizes="100vw" className="object-cover object-[62%_35%]" />
      <div className="absolute inset-0 bg-linear-to-t from-background/90 from-5% via-background/40 via-45% to-transparent to-75%" />
      <div className="absolute inset-0 bg-linear-to-r from-background/60 via-background/20 via-40% to-transparent to-65%" />
    </div>

    {/* Low on every screen, just above the facts, so the building and its sign stay in view */}
    <div className="mx-auto flex w-full max-w-[84rem] flex-1 flex-col justify-end px-6 pt-[45svh] pb-12 md:px-8 lg:pt-28 lg:pb-16">
      <div className="max-w-2xl">
        <p data-reveal className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-sm font-medium text-foreground backdrop-blur-sm">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
          Plataforma de gestión educativa
        </p>
        <h1 id="hero-title" data-reveal style={revealDelay(60)} className="mt-5 max-w-xl text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.05] font-semibold tracking-[-0.03em] text-balance text-brand">
          Toda tu institución, en una sola plataforma.
        </h1>
        <div data-reveal style={revealDelay(180)} className="mt-8 flex flex-wrap gap-3">
          <Link href="/auth/signin" className="btn-brand h-12 px-6 text-base">
            <MorphIcon icon={LogIn} size={18} />
            Ingresar al panel
          </Link>
          <Link href="/contact" className="btn-alt h-12 px-6 text-base backdrop-blur-sm">
            <MorphIcon icon={Send} size={18} />
            Solicitar una demostración
          </Link>
        </div>
        <p data-reveal style={revealDelay(240)} className="mt-6 text-sm font-medium text-foreground/85">
          Para {supportedInstitutions.slice(0, -1).join(', ')} e {supportedInstitutions.at(-1)}.
        </p>
      </div>
    </div>

    {/* Facts at the bottom edge of the photo: what every institution gets */}
    <div className="mx-auto w-full max-w-[84rem] px-6 pb-10 md:px-8">
      <dl data-reveal style={revealDelay(300)} className="grid max-w-3xl grid-cols-1 gap-4 border-t border-foreground/20 pt-6 sm:grid-cols-3 sm:gap-8">
        {heroFacts.map(({ value, label }): JSX.Element => (
          <div key={value} className="flex flex-col-reverse">
            <dt className="mt-1 text-sm text-foreground/75">{label}</dt>
            <dd className="text-xl font-semibold tracking-tight text-foreground">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  </section>
);
