import Link from 'next/link';
import type { JSX } from 'react';
import { LogIn, Send } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';

// Closing band: see it with your own institution's data, or go straight to the panel
export const LandingContact = (): JSX.Element => (
  <section aria-labelledby="landing-contact-title" className="bg-brand-solid text-white">
    <div data-reveal="scale" className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-16 md:flex-row md:items-center md:justify-between md:px-8 md:py-20">
      <div className="max-w-xl">
        <h2 id="landing-contact-title" className="text-[clamp(1.75rem,3.2vw,2.5rem)] leading-tight font-semibold tracking-[-0.025em] text-balance">
          Te mostramos el panel con la estructura de tu institución.
        </h2>
        <p className="mt-4 text-white/85">Una demostración de 30 minutos con dirección o secretaría, en línea o en tu sede.</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link href="/contact" className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 text-base font-semibold text-brand-solid transition-colors hover:bg-white/90">
          <MorphIcon icon={Send} size={18} />
          Solicitar una demostración
        </Link>
        <Link href="/auth/signin" className="inline-flex h-12 items-center gap-2 rounded-full border border-white/40 px-7 text-base font-semibold text-white transition-colors hover:bg-white/10">
          <MorphIcon icon={LogIn} size={18} />
          Ingresar
        </Link>
      </div>
    </div>
  </section>
);
