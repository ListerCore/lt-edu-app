import Link from 'next/link';
import type { JSX } from 'react';
import { LogIn, Send } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { revealDelay } from '@/lib/reveal';
import { supportedInstitutions } from '../data/landing-data';
import { LandingConsole } from './landing-console';

// Hero: what the system does in one sentence, the two ways in, and the attendance screen being fed by an ID card as the visual anchor
export const LandingHero = (): JSX.Element => (
  <section aria-labelledby="hero-title" className="relative overflow-x-clip">
    <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-[84rem] content-center items-center gap-14 px-6 py-16 md:px-8 lg:grid-cols-[1fr_1.3fr] lg:gap-8">
      <div className="max-w-xl">
        <h1 id="hero-title" data-reveal className="text-[clamp(2.6rem,5.6vw,4.4rem)] leading-[1.02] font-semibold tracking-[-0.04em] text-balance text-foreground">
          La gestión de tu institución, en un solo panel.
        </h1>
        <p data-reveal style={revealDelay(90)} className="mt-6 max-w-lg text-lg leading-8 text-muted-foreground">
          Matrícula, asistencia con el carnet, notas, pensiones y comunicados conectados entre sí. Dirección, secretaría, docentes y familias trabajan sobre los mismos datos.
        </p>
        <div data-reveal style={revealDelay(180)} className="mt-9 flex flex-wrap gap-3">
          <Link href="/auth/signin" className="btn-brand h-12 px-6 text-base">
            <MorphIcon icon={LogIn} size={18} />
            Ingresar al panel
          </Link>
          <Link href="/contact" className="btn-alt h-12 px-6 text-base">
            <MorphIcon icon={Send} size={18} />
            Solicitar una demostración
          </Link>
        </div>
        <div data-reveal style={revealDelay(260)} className="mt-12 border-t border-border pt-6">
          <p className="text-sm font-medium text-foreground">Hecho para la educación peruana</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {supportedInstitutions.map((name): JSX.Element => (
              <li key={name} className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground">
                {name}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <LandingConsole />
    </div>
  </section>
);
