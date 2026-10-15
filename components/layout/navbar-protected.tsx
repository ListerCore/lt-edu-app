'use client';

import type { JSX } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, BookOpen, CalendarDays, ClipboardCheck, GraduationCap, LayoutDashboard, Search, Users } from 'lucide-react';
import { ThemeToggle } from '@/components/providers/theme';
import { UserMenu } from '@/components/layout/user-menu';

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
          <UserMenu />
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
