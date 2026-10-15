'use client';

import type { JSX } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, BookOpen, CalendarDays, ChevronDown, ClipboardCheck, GraduationCap, LayoutDashboard, LogOut, Search, Settings2, UserRound, Users } from 'lucide-react';
import { ThemeToggle } from '@/components/providers/theme';

const navigationItems = [
  { label: 'Panel principal', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Estudiantes', href: '/dashboard/students', icon: Users },
  { label: 'Matrícula y expedientes', href: '/dashboard/enrollment', icon: ClipboardCheck },
  { label: 'Asistencia virtual', href: '/dashboard/attendance', icon: CalendarDays },
  { label: 'Evaluación', href: '/dashboard/evaluation', icon: GraduationCap },
  { label: 'Aulas virtuales', href: '/dashboard/classrooms', icon: BookOpen },
];

const NavbarProtected = (): JSX.Element => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/dashboard" aria-label="SIGE-JL, panel principal" className="flex min-w-0 shrink-0 items-center gap-2.5">
          <Image src="/logo.png" alt="Escudo CEBA Joseph Lister" width={38} height={38} priority className="size-9 shrink-0 object-contain" />
          <span className="min-w-0 leading-tight">
            <span className="block text-xs font-bold text-foreground sm:text-sm">CEBA Joseph Lister</span>
            <span className="block text-[9px] font-semibold tracking-wide text-muted-foreground">SISTEMA SIGE-JL</span>
          </span>
          <span className="hidden rounded-sm border border-border bg-muted px-2 py-1 text-[10px] font-semibold text-muted-foreground md:inline-flex">Ayacucho</span>
        </Link>

        <label className="relative hidden max-w-md flex-1 lg:block">
          <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input type="search" placeholder="Buscar en SIGE-JL..." className="h-9 w-full rounded-md border border-border bg-muted/60 pl-9 pr-3 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus:bg-card" />
        </label>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <button type="button" aria-label="Notificaciones" className="relative flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <Bell aria-hidden="true" className="size-4" />
            <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-secondary" />
          </button>
          <ThemeToggle className="size-9 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground" />
          <span aria-hidden="true" className="mx-1 hidden h-7 w-px bg-border sm:block" />
          <details className="group relative">
            <summary aria-label="Abrir menú de usuario" className="flex cursor-pointer list-none items-center gap-2 rounded-md px-1.5 py-1 hover:bg-muted [&::-webkit-details-marker]:hidden">
              <Image src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=96&h=96&q=80" alt="" width={34} height={34} unoptimized className="size-8.5 rounded-full border border-border object-cover" />
              <span className="hidden max-w-44 text-left sm:block">
                <span className="block truncate text-[10px] font-bold text-foreground">Fernando Prado</span>
                <span className="mt-0.5 block truncate text-[9px] text-muted-foreground">Promotor General</span>
              </span>
              <ChevronDown aria-hidden="true" className="hidden size-3.5 text-muted-foreground transition-transform group-open:rotate-180 sm:block" />
            </summary>
            <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-border bg-card p-1.5 shadow-lg">
              <div className="border-b border-border px-2.5 py-2 sm:hidden">
                <p className="text-xs font-semibold text-card-foreground">Fernando Prado</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">Promotor General</p>
              </div>
              <Link href="/profile" onClick={(event): void => event.currentTarget.closest('details')?.removeAttribute('open')} className="flex min-h-10 items-center gap-2.5 rounded-md px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-muted">
                <UserRound aria-hidden="true" className="size-4 text-muted-foreground" />
                Mi perfil
              </Link>
              <Link href="/dashboard/settings" onClick={(event): void => event.currentTarget.closest('details')?.removeAttribute('open')} className="flex min-h-10 items-center gap-2.5 rounded-md px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-muted">
                <Settings2 aria-hidden="true" className="size-4 text-muted-foreground" />
                Configuración
              </Link>
              <div className="my-1 border-t border-border" />
              <Link href="/auth/signin" onClick={(event): void => event.currentTarget.closest('details')?.removeAttribute('open')} className="flex min-h-10 items-center gap-2.5 rounded-md px-2.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10">
                <LogOut aria-hidden="true" className="size-4" />
                Cerrar sesión
              </Link>
            </div>
          </details>
        </div>
      </div>

      <nav aria-label="Navegación institucional" className="border-t border-border bg-muted/30">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-3 py-1 sm:px-6 lg:px-8">
          {navigationItems.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(`${href}/`));
            return (
              <Link key={href} href={href} aria-current={active ? 'page' : undefined} className={`relative inline-flex min-h-10 shrink-0 items-center gap-2 px-3 text-[10px] font-semibold transition-colors sm:text-[11px] ${active ? 'text-secondary after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:bg-secondary' : 'text-muted-foreground hover:text-foreground'}`}>
                <Icon aria-hidden="true" className="size-4" />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
};

export { NavbarProtected };
