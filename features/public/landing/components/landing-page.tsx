import Link from 'next/link';
import type { JSX } from 'react';
import { ClipboardList, LogIn } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { siteConfig } from '@/lib/site';

// Home hero placeholder: welcome, admission and sign-in; the landing sections come next
export const LandingPage = (): JSX.Element => (
  <section className="relative flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center gap-6 px-4 text-center">
    <div aria-hidden="true" className="hero-glow" />
    <span className="pill bg-brand-soft text-brand">{siteConfig.tagline}</span>
    <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-balance sm:text-6xl">
      Bienvenidos a <span className="text-gradient">{siteConfig.name}</span>
    </h1>
    <p className="max-w-md text-muted-foreground">Conoce nuestra oferta educativa, el proceso de admisión y los últimos comunicados de la institución.</p>
    <div className="flex flex-wrap justify-center gap-3">
      <Link href="/#admissions" className="btn-brand">
        <MorphIcon icon={ClipboardList} size={16} />
        Admisión
      </Link>
      <Link href="/auth/signin" className="btn-alt">
        <MorphIcon icon={LogIn} size={16} />
        Ingresar
      </Link>
    </div>
  </section>
);
