import type { JSX } from 'react';
import { ArrowRight, BookOpen } from 'lucide';
import { ThemeSwitcher } from '@/components/layout/theme-switcher';
import { MorphIcon } from '@/components/ui/morph-icon';

// Placeholder landing: hello world rendered with the shared brand tokens and morphicons
export const LandingPage = (): JSX.Element => (
  <section className="relative flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
    <div aria-hidden="true" className="hero-glow" />
    <span className="pill bg-brand-soft text-brand">joseph-app</span>
    <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
      Hello, <span className="text-gradient">world</span>
    </h1>
    <p className="max-w-md text-muted-foreground">Estructura inicial lista. Empieza a construir en features/.</p>
    <div className="flex gap-3">
      <button type="button" className="btn-brand">
        Empezar
        <MorphIcon icon={ArrowRight} size={16} />
      </button>
      <button type="button" className="btn-alt">
        <MorphIcon icon={BookOpen} size={16} />
        Documentación
      </button>
    </div>
    <ThemeSwitcher />
  </section>
);
