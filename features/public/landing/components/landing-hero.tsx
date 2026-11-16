import Image from 'next/image';
import Link from 'next/link';
import type { JSX } from 'react';
import { LogIn, Send } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { revealDelay } from '@/lib/reveal';
import { heroFacts, supportedInstitutions } from '../data/landing-data';

// Hero: the campus photo covers the whole first screen (behind the translucent navbar too) with no overlay; the text is
// always white with a soft shadow so it reads on the photo in both themes, and stays left of the building's sign
export const LandingHero = (): JSX.Element => (
  <section aria-labelledby="hero-title" className="relative isolate -mt-16 flex min-h-svh flex-col overflow-hidden">
    {/* Campus backdrop, shown as is: no washes, so the whole photo stays visible */}
    <div aria-hidden="true" className="absolute inset-0 -z-1">
      <Image src="/campus.jpg" alt="" fill priority sizes="100vw" className="object-cover object-[62%_35%]" />
    </div>

    {/* Low on phones so the sign at the top of the photo stays visible; centered beside it on wide screens */}
    <div className="mx-auto flex w-full max-w-[84rem] flex-1 flex-col justify-end px-6 pt-[45svh] pb-12 md:px-8 lg:justify-center lg:pt-28">
      <div className="max-w-2xl">
        <p data-reveal className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-sm font-medium text-foreground backdrop-blur-sm">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
          Plataforma de gestión educativa
        </p>
        <h1 id="hero-title" data-reveal style={revealDelay(60)} className="mt-5 max-w-xl text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.05] font-semibold tracking-[-0.03em] text-balance text-white [text-shadow:0_2px_24px_rgb(0_0_0/0.55)]">
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
        <p data-reveal style={revealDelay(240)} className="mt-6 text-sm font-medium text-white [text-shadow:0_1px_12px_rgb(0_0_0/0.7)]">
          Para {supportedInstitutions.slice(0, -1).join(', ')} e {supportedInstitutions.at(-1)}.
        </p>
      </div>
    </div>

    {/* Facts at the bottom edge of the photo: what every institution gets */}
    <div className="mx-auto w-full max-w-[84rem] px-6 pb-10 md:px-8">
      <dl data-reveal style={revealDelay(300)} className="grid max-w-3xl grid-cols-1 gap-4 border-t border-white/30 pt-6 sm:grid-cols-3 sm:gap-8 [text-shadow:0_1px_12px_rgb(0_0_0/0.7)]">
        {heroFacts.map(({ value, label }): JSX.Element => (
          <div key={value} className="flex flex-col-reverse">
            <dt className="mt-1 text-sm text-white/90">{label}</dt>
            <dd className="text-xl font-semibold tracking-tight text-white">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  </section>
);
