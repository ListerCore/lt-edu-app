'use client';

import { Suspense, type JSX } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, Bell, BookOpen, CalendarDays, ChevronDown, ClipboardCheck, DatabaseBackup, FileBarChart2, GraduationCap, LayoutDashboard, LogOut, Search, Settings2, ShieldCheck, UserRound, Users, Wallet } from 'lucide-react';
import { ThemeToggle } from '@/components/providers/theme';
import { Permissions } from '@/components/layout/permissions';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarInset, SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarSeparator, SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import type { DashboardNavigationProps, DashboardNavigationSection } from '@/features/private/dashboard/types';

const sections: DashboardNavigationSection[] = [
  { label: 'PRINCIPAL', items: [{ label: 'Panel principal', href: '/dashboard', icon: LayoutDashboard }] },
  {
    label: 'GESTIÓN ACADÉMICA',
    items: [
      { label: 'Estudiantes', href: '/dashboard/students', icon: Users },
      { label: 'Matrícula y expedientes', href: '/dashboard/enrollment', icon: ClipboardCheck },
      { label: 'Asistencia virtual', href: '/dashboard/attendance', icon: CalendarDays },
      { label: 'Evaluación', href: '/dashboard/evaluation', icon: GraduationCap },
      { label: 'Aulas virtuales', href: '/dashboard/classrooms', icon: BookOpen },
      { label: 'Tutoría y bienestar', href: '/dashboard/wellbeing', icon: ShieldCheck },
    ],
  },
  {
    label: 'ADMINISTRACIÓN',
    items: [
      { label: 'Gestión económica', href: '/dashboard/finance', icon: Wallet },
      { label: 'Reportes y analítica', href: '/dashboard/reports', icon: FileBarChart2 },
      { label: 'Backup y recuperación', href: '/dashboard/backup', icon: DatabaseBackup },
      { label: 'Alertas e inteligencia', href: '/dashboard/alerts', icon: Activity },
      { label: 'Configuración', href: '/dashboard/settings', icon: Settings2 },
    ],
  },
];

const SidebarRoutes = (): JSX.Element => {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <>
      {sections.map((section) => (
        <SidebarGroup key={section.label} className="px-1 py-1">
          <SidebarGroupLabel className="h-7 px-2 text-[9px] font-bold tracking-[0.14em] text-muted-foreground">{section.label}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {section.items.map(({ label, href, icon: Icon }) => {
                const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(`${href}/`));
                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      render={
                        <Link
                          href={href}
                          aria-current={active ? 'page' : undefined}
                          onClick={(): void => {
                            if (isMobile) setOpenMobile(false);
                          }}
                        />
                      }
                      isActive={active}
                      tooltip={label}
                      className="h-9 px-3 text-[11px] font-semibold data-active:bg-primary data-active:text-primary-foreground"
                    >
                      <Icon aria-hidden="true" />
                      <span>{label}</span>
                    </SidebarMenuButton>
                    {href === '/dashboard/enrollment' && <SidebarMenuBadge className="right-2 rounded bg-accent px-1.5 py-0.5 text-[9px] font-bold text-accent-foreground">EBA</SidebarMenuBadge>}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
};

const Navigation = ({ children }: DashboardNavigationProps): JSX.Element => (
  <SidebarProvider defaultOpen>
    <Sidebar collapsible="icon">
      <Permissions placement="header" />
      <SidebarContent className="gap-1 px-2 py-3">
        <Suspense
          fallback={
            <div aria-hidden="true" className="space-y-4 px-2">
              {sections.map((section) => (
                <div key={section.label} className="space-y-2">
                  <div className="h-3 w-24 rounded bg-muted" />
                  {section.items.map((item) => (
                    <div key={item.href} className="h-8 rounded bg-muted" />
                  ))}
                </div>
              ))}
            </div>
          }
        >
          <SidebarRoutes />
        </Suspense>
      </SidebarContent>
      <Permissions placement="footer" />
    </Sidebar>
    <SidebarInset>
      <header className="sticky top-0 z-30 flex h-17 items-center justify-between gap-4 border-b border-border bg-card/95 px-4 backdrop-blur sm:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <SidebarTrigger aria-label="Alternar navegación" />
          <details className="relative md:hidden">
            <summary aria-label="Buscar" className="flex size-9 cursor-pointer list-none items-center justify-center rounded-md text-muted-foreground hover:bg-muted [&::-webkit-details-marker]:hidden">
              <Search aria-hidden="true" className="size-4" />
            </summary>
            <div className="absolute left-0 top-full z-40 mt-2 w-[min(18rem,calc(100vw-2rem))] rounded-lg border border-border bg-card p-2 shadow-lg">
              <input type="search" placeholder="Buscar estudiantes, docentes..." className="h-10 w-full rounded-md border border-border bg-muted px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus:bg-card" />
            </div>
          </details>
          <label className="relative hidden max-w-105 flex-1 md:block">
            <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input type="search" placeholder="Buscar estudiantes, docentes..." className="h-9 w-full rounded-md border border-border bg-muted pl-9 pr-3 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus:bg-card" />
          </label>
          <div className="hidden items-center gap-2 rounded-md border border-border px-3 py-2 xl:flex">
            <CalendarDays aria-hidden="true" className="size-3.5 text-primary" />
            <span className="text-[10px] font-bold text-card-foreground">Periodo 2026-II</span>
            <span className="rounded bg-secondary/10 px-1.5 py-0.5 text-[9px] font-bold text-secondary">VIGENTE</span>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle className="size-9 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground" />
          <button type="button" title="Notificaciones" className="relative flex size-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted">
            <Bell aria-hidden="true" className="size-4.5" />
            <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-background">3</span>
          </button>
          <SidebarSeparator orientation="vertical" className="mx-1 h-7" />
          <details className="group relative">
            <summary aria-label="Abrir menú de usuario" className="flex cursor-pointer list-none items-center gap-2 rounded-md px-1.5 py-1 hover:bg-muted [&::-webkit-details-marker]:hidden">
              <Image src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=96&h=96&q=80" alt="" width={34} height={34} unoptimized className="size-8.5 rounded-full border border-border object-cover" />
              <span className="hidden text-left sm:block">
                <span className="block text-[10px] font-bold text-card-foreground">Fernando Prado</span>
                <span className="mt-0.5 block text-[9px] text-muted-foreground">Promotor General</span>
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
      </header>
      {children}
    </SidebarInset>
  </SidebarProvider>
);

export { Navigation };
