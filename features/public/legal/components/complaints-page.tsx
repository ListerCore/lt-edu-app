import type { JSX } from 'react';
import { BookOpen } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { siteConfig } from '@/lib/site';
import { ComplaintsForm } from './complaints-form';

// Libro de Reclamaciones virtual (Código de Protección y Defensa del Consumidor, Ley N.° 29571)
export const ComplaintsPage = (): JSX.Element => (
  <div className="mx-auto max-w-6xl px-6 py-12 md:px-8 md:py-20">
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
      <header className="lg:col-span-4">
        <div className="lg:sticky lg:top-32">
          <p className="pill bg-brand-soft text-brand">
            <span className="font-mono text-[11px] opacity-70">LEG/03</span>
            Ley N.° 29571
          </p>
          <h1 className="mt-5 text-[clamp(2rem,4.5vw,2.75rem)] leading-tight font-bold tracking-tight text-balance text-foreground">
            Libro de <span className="text-gradient">Reclamaciones.</span>
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">Conforme al Código de Protección y Defensa del Consumidor, este establecimiento cuenta con un Libro de Reclamaciones virtual a tu disposición.</p>

          <dl className="mt-8 space-y-2 text-sm">
            <div className="rounded-lg bg-surface px-4 py-3">
              <dt className="text-xs font-medium text-muted-foreground">Proveedor</dt>
              <dd className="mt-1 font-medium text-foreground">{siteConfig.name}</dd>
            </div>
            <div className="rounded-lg bg-surface px-4 py-3">
              <dt className="text-xs font-medium text-muted-foreground">Plazo de respuesta</dt>
              <dd className="mt-1 font-medium text-foreground">15 días hábiles como máximo</dd>
            </div>
            <div className="rounded-lg bg-surface px-4 py-3">
              <dt className="text-xs font-medium text-muted-foreground">Contacto</dt>
              <dd className="mt-1 font-medium break-all text-foreground">{siteConfig.emails.support}</dd>
            </div>
          </dl>

          <p className="mt-6 flex items-start gap-3 rounded-lg border-l-2 border-brand bg-brand-soft p-4 text-xs leading-relaxed text-muted-foreground">
            <MorphIcon icon={BookOpen} size={16} className="mt-0.5 shrink-0 text-brand" />
            La formulación del reclamo no impide acudir a otras vías de solución de controversias ni es requisito previo para interponer una denuncia ante el INDECOPI.
          </p>
        </div>
      </header>

      <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-[0_24px_64px_-32px_rgb(0_0_0/0.3)] lg:col-span-8">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-surface px-6 py-3 md:px-8">
          <span className="text-xs font-medium text-muted-foreground">Hoja de reclamación virtual</span>
          <span className="text-xs font-medium text-muted-foreground">N.° asignado al enviar</span>
        </div>
        <ComplaintsForm />
      </div>
    </div>
  </div>
);
