'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { JSX } from 'react';
import { ArrowRight, GraduationCap, LayoutDashboard, Menu, Monitor, UserRound } from 'lucide-react';
import { ThemeToggle } from '../providers/theme';
import { ActiveNavigationLink } from './active-navigation';
import { UserMenu } from './user-menu';
import { useAuthSession } from '@/lib/auth-session';

const navigationItems: Array<{ label: string; href: string }> = [
  { label: 'Nosotros', href: '/#about-us' },
  { label: 'Ciclos', href: '/#programs' },
  { label: 'Modalidad Virtual', href: '/#virtual-learning' },
  { label: 'Admisión', href: '/#admissions' },
  { label: 'Tutoriales', href: '/help' },
  { label: 'Contacto', href: '/contact' },
];

const Navbar = (): JSX.Element => {
  const { isAuthenticated, isLoaded } = useAuthSession();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/95 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="CEBA Joseph Lister, inicio">
          <Image src="/logo.png" alt="" width={40} height={40} priority className="size-10 object-contain" />
          <span className="flex min-w-0 flex-col leading-none">
            <span className="font-heading text-[13px] font-bold tracking-tight text-foreground">CEBA Joseph Lister</span>
            <span className="mt-1 hidden text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground sm:block">Educación Básica Alternativa · Ayacucho</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Navegación principal">
          {navigationItems.map((item): JSX.Element => (
            <ActiveNavigationLink key={item.label} href={item.href} label={item.label} />
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <ThemeToggle className="size-9 rounded-lg text-muted-foreground" />
          {isLoaded && isAuthenticated ? (
            <Link
              href="/dashboard"
              className="hidden h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 text-[11px] font-semibold text-foreground transition-colors hover:bg-accent sm:inline-flex"
            >
              <LayoutDashboard aria-hidden="true" className="size-4 text-secondary" />
              Ir al panel
            </Link>
          ) : (
            <Link
              href="/auth/signin"
              className="hidden h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 text-[11px] font-semibold text-foreground transition-colors hover:bg-accent sm:inline-flex"
            >
              <Monitor aria-hidden="true" className="size-4 text-secondary" />
              Aula Virtual
            </Link>
          )}
          <Link href="/#admissions" className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-[11px] font-semibold text-primary-foreground shadow-sm transition-colors hover:opacity-90 sm:px-4">
            <GraduationCap aria-hidden="true" className="size-4" />
            <span className="hidden sm:inline">Matricúlate</span>
            <ArrowRight aria-hidden="true" className="size-3.5 sm:hidden" />
          </Link>
          {isLoaded && isAuthenticated ? (
            <UserMenu showRoleLabel={false} />
          ) : (
            <Link
              href="/auth/signin"
              aria-label="Acceso de usuario"
              className="hidden size-9 place-items-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground md:grid"
            >
              <UserRound aria-hidden="true" className="size-4" />
            </Link>
          )}
          <details className="group relative xl:hidden">
            <summary aria-label="Abrir menú" className="grid size-10 cursor-pointer list-none place-items-center rounded-lg border border-border bg-card text-foreground [&::-webkit-details-marker]:hidden">
              <Menu aria-hidden="true" className="size-4 group-open:hidden" />
              <span aria-hidden="true" className="hidden text-xl leading-none group-open:block">
                ×
              </span>
            </summary>
            <nav aria-label="Navegación móvil" className="absolute right-0 top-12 grid w-[min(20rem,calc(100vw-2rem))] gap-1 rounded-xl border border-border bg-card p-2 shadow-xl">
              {navigationItems.map((item): JSX.Element => (
                <ActiveNavigationLink key={item.label} href={item.href} label={item.label} mobile />
              ))}
              {isLoaded && isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className="mt-1 flex min-h-11 items-center gap-2 rounded-lg border-t border-border px-3 pt-2 text-[13px] font-semibold text-foreground"
                >
                  <LayoutDashboard aria-hidden="true" className="size-4 text-secondary" />
                  Ir al panel
                </Link>
              ) : (
                <Link
                  href="/auth/signin"
                  className="mt-1 flex min-h-11 items-center gap-2 rounded-lg border-t border-border px-3 pt-2 text-[13px] font-semibold text-foreground"
                >
                  <Monitor aria-hidden="true" className="size-4 text-secondary" />
                  Aula Virtual
                </Link>
              )}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
};

export { Navbar };
