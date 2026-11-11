import Link from 'next/link';
import type { JSX } from 'react';
import { ArrowLeft, ArrowUpRight, LayoutGrid, LogIn, Mail, Megaphone } from 'lucide';
import type { IconInput } from 'morphicons/react';
import { MorphIcon } from '@/components/ui/morph-icon';
import { RequestedPath } from './requested-path';

const suggestions: Array<{ icon: IconInput; label: string; description: string; href: string }> = [
  { icon: LayoutGrid, label: 'Módulos', description: 'Matrícula, asistencia, notas, pensiones y comunicados.', href: '/#modules' },
  { icon: LogIn, label: 'Ingresar', description: 'Entra al panel con tu correo o con Google.', href: '/auth/signin' },
  { icon: Megaphone, label: 'Comunicados', description: 'Anuncios y avisos para estudiantes y familias.', href: '/news' },
  { icon: Mail, label: 'Contacto', description: 'Escríbenos o visítanos en nuestra sede.', href: '/contact' },
];

// 404: requested route as a failed request, gradient numeral, the way back and the most useful pages
export const NotFoundPage = (): JSX.Element => (
  <section aria-labelledby="not-found-title" className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-5xl flex-col justify-center px-6 py-16 md:px-8">
    <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
      <div className="flex flex-col items-start">
        <div className="w-full max-w-md rounded-lg border border-border bg-surface px-3 py-2">
          <RequestedPath />
        </div>
        <h1 id="not-found-title" className="mt-6 text-[clamp(2.25rem,4.5vw,3.25rem)] leading-[1.08] font-semibold tracking-tight text-balance text-foreground">
          Esta página no existe <span className="text-gradient">o cambió de lugar.</span>
        </h1>
        <p className="mt-5 max-w-lg text-lg leading-8 text-muted-foreground">Revisa el enlace o sigue por alguna de las secciones de abajo. Si llegaste aquí desde nuestro sitio, avísanos y lo corregimos.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="btn-brand">
            <MorphIcon icon={ArrowLeft} size={16} />
            Volver al inicio
          </Link>
          <Link href="/contact" className="btn-alt">
            Reportar el enlace
          </Link>
        </div>
      </div>

      <p aria-hidden="true" className="text-gradient hidden text-[clamp(8rem,16vw,13rem)] leading-none font-bold tracking-tighter select-none lg:block">
        404
      </p>
    </div>

    <nav aria-labelledby="not-found-suggestions" className="mt-16">
      <h2 id="not-found-suggestions" className="text-sm font-semibold text-foreground">
        Quizás buscabas
      </h2>
      <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {suggestions.map(({ icon, label, description, href }): JSX.Element => (
          <li key={href}>
            <Link href={href} className="group flex h-full flex-col rounded-xl border border-border bg-background p-5 transition-colors hover:border-brand">
              <span className="flex items-center justify-between">
                <span className="icon-box size-10 bg-brand-soft text-brand">
                  <MorphIcon icon={icon} size={20} />
                </span>
                <MorphIcon icon={ArrowUpRight} size={16} className="text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
              </span>
              <span className="mt-4 font-semibold text-foreground">
                <span className="link-underline">{label}</span>
              </span>
              <span className="mt-1 text-sm leading-6 text-muted-foreground">{description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  </section>
);
