import Link from 'next/link';
import type { JSX } from 'react';
import { Mail, MapPin } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { siteConfig } from '@/lib/site';

// Closing band: where to write or come by
export const LandingContact = (): JSX.Element => (
  <section aria-labelledby="landing-contact-title" className="bg-brand-solid text-white">
    <div data-reveal="scale" className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-16 md:flex-row md:items-center md:justify-between md:px-8 md:py-20">
      <div className="max-w-xl">
        <h2 id="landing-contact-title" className="text-[clamp(1.75rem,3.2vw,2.5rem)] leading-tight font-semibold tracking-[-0.025em] text-balance">
          ¿Tienes una consulta? Secretaría te responde en un día hábil.
        </h2>
        <p className="mt-4 flex items-center gap-2 text-white/85">
          <MorphIcon icon={MapPin} size={16} />
          {siteConfig.office.city}
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link href="/contact" className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-brand-solid transition-colors hover:bg-white/90">
          Escribirnos
        </Link>
        <a href={`mailto:${siteConfig.emails.info}`} className="inline-flex h-11 items-center gap-2 rounded-full border border-white/40 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10">
          <MorphIcon icon={Mail} size={16} />
          {siteConfig.emails.info}
        </a>
      </div>
    </div>
  </section>
);
