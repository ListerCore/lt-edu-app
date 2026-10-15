import type { JSX } from 'react';
import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowRight, CalendarDays, ChevronRight, Download, Fingerprint, LayoutDashboard, MapPin, ShieldCheck, UserPlus } from 'lucide-react';
import { SettingsTabsPanel } from './settings-tabs-panel';

const SettingsPage = (): JSX.Element => (
  <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4 px-4 py-5 sm:gap-5 sm:px-6 sm:py-6 lg:px-8">
    <div className="flex flex-wrap items-center gap-2 text-[9px] text-muted-foreground">
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 hover:text-foreground">
        <LayoutDashboard aria-hidden="true" className="size-3.5" />
        CEBA Joseph Lister
      </Link>
      <ChevronRight aria-hidden="true" className="size-3" />
      <Link href="/dashboard/settings" className="hover:text-foreground">
        Configuración institucional
      </Link>
      <ChevronRight aria-hidden="true" className="size-3" />
      <span className="font-semibold text-foreground">Administración, roles y seguridad</span>
    </div>

    <section className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 sm:p-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-2.5 py-1 text-[8px] font-bold text-secondary">
            <span className="size-1.5 animate-pulse rounded-full bg-secondary" /> Ciberdefensa EBA: activa
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-[8px] font-semibold text-accent-foreground">
            <Fingerprint aria-hidden="true" className="size-3" /> 2FA obligatorio para personal
          </span>
        </div>
        <h1 className="mt-3 max-w-3xl font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Centro de Control de Identidad y Seguridad</h1>
        <p className="mt-2 max-w-2xl text-[10px] leading-5 text-muted-foreground sm:text-xs">Administra cuentas, roles y políticas de acceso del CEBA desde un espacio unificado de control institucional.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-[9px] font-semibold text-foreground hover:bg-muted">
          <MapPin aria-hidden="true" className="size-3.5 text-primary" /> Sede Central Ayacucho
        </button>
        <span className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-[9px] font-semibold text-foreground">
          <CalendarDays aria-hidden="true" className="size-3.5 text-primary" /> 2026-II
        </span>
        <Link href="/dashboard/settings?tab=security" className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-[9px] font-semibold text-primary-foreground hover:opacity-90">
          <ShieldCheck aria-hidden="true" className="size-3.5" /> Políticas
        </Link>
      </div>
    </section>

    <div className="flex flex-wrap gap-2">
      <Link href="/dashboard/settings?tab=audit" className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-card px-2.5 text-[9px] font-semibold text-foreground hover:bg-muted">
        <Download aria-hidden="true" className="size-3.5" /> Exportar auditoría
      </Link>
      <Link href="/dashboard/settings?tab=accounts" className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-2.5 text-[9px] font-semibold text-primary-foreground hover:opacity-90">
        <UserPlus aria-hidden="true" className="size-3.5" /> Nuevo usuario
      </Link>
      <span className="ml-auto hidden items-center gap-1.5 text-[9px] text-muted-foreground sm:inline-flex">
        <span className="size-1.5 rounded-full bg-secondary" /> Servicios institucionales operativos <ArrowRight aria-hidden="true" className="size-3" />
      </span>
    </div>

    <Suspense fallback={<div className="h-10 animate-pulse rounded-lg bg-muted" />}>
      <SettingsTabsPanel />
    </Suspense>
    <div className="flex items-center justify-between border-t border-border pt-3 text-[9px] text-muted-foreground">
      <span>CEBA Privado Virtual Joseph Lister · Control de identidad SIGE-JL</span>
      <span>Entorno homologado · DREA Ayacucho</span>
    </div>
  </div>
);

export { SettingsPage };
