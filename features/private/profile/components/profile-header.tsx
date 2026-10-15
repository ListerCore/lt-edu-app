import type { JSX } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, CalendarDays, ChevronRight, Download, LayoutDashboard, MapPin, PencilLine, ShieldCheck } from 'lucide-react';
import { ThemeToggle } from '@/components/providers/theme';
import { profileSectionLinks } from '../data/profile-data';

const ProfileHeader = (): JSX.Element => (
  <>
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-card/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      <Link href="/dashboard" className="flex min-w-0 items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-extrabold text-primary-foreground">JL</span>
        <span className="min-w-0">
          <span className="block text-xs font-extrabold tracking-tight text-primary">SIGE-JL</span>
          <span className="block truncate text-[9px] text-muted-foreground">CEBA Privado Virtual Joseph Lister</span>
        </span>
      </Link>
      <div className="flex shrink-0 items-center gap-2">
        <span className="hidden text-[10px] font-semibold text-muted-foreground sm:block">Ayacucho · Perú</span>
        <ThemeToggle className="size-9 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground" />
        <Link href="/dashboard" className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-[10px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:text-[11px]">
          <ArrowLeft aria-hidden="true" className="size-3.5" />
          <span className="hidden sm:inline">Volver al panel</span>
          <span className="sm:hidden">Panel</span>
        </Link>
      </div>
    </header>
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <nav aria-label="Migas de pan" className="flex items-center gap-2 text-[11px] text-muted-foreground">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground">
          <LayoutDashboard aria-hidden="true" className="size-3.5" />
          Panel principal
        </Link>
        <ChevronRight aria-hidden="true" className="size-3.5" />
        <span aria-current="page" className="font-semibold text-foreground">
          Mi perfil
        </span>
      </nav>
      <Link href="/dashboard" className="inline-flex h-9 w-fit items-center gap-2 rounded-md bg-muted px-3 text-[11px] font-semibold text-foreground transition-colors hover:bg-accent">
        <ArrowLeft aria-hidden="true" className="size-3.5" /> Volver al panel
      </Link>
    </div>
    <section aria-labelledby="profile-heading" className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="relative h-28 overflow-hidden bg-primary sm:h-36">
        <div aria-hidden="true" className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,color-mix(in_srgb,var(--primary-foreground)_45%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_srgb,var(--primary-foreground)_45%,transparent)_1px,transparent_1px)] bg-size-[24px_24px]" />
        <div className="absolute inset-0 bg-linear-to-r from-primary via-primary/75 to-secondary/50" />
        <div className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-primary-foreground/15 bg-primary-foreground/10 px-2.5 py-1 text-[9px] font-semibold text-primary-foreground backdrop-blur sm:right-5 sm:top-4 sm:px-3 sm:text-[10px]">
          <ShieldCheck aria-hidden="true" className="size-3.5" /> SIGE-JL · Ayacucho
        </div>
      </div>
      <div className="relative flex flex-col gap-4 px-4 pb-5 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:gap-6 lg:px-8">
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
          <div className="-mt-10 flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-card bg-muted sm:-mt-12 sm:size-24">
            <Image src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=192&h=192&q=80" alt="Foto de Fernando Prado" width={96} height={96} unoptimized className="size-full object-cover" />
          </div>
          <div className="min-w-0 pb-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 id="profile-heading" className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Fernando Prado
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-2 py-1 text-[9px] font-bold text-secondary">
                <span className="size-1.5 rounded-full bg-secondary" /> Activo
              </span>
            </div>
            <p className="mt-1 text-xs font-semibold text-primary">Promotor General</p>
            <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <MapPin aria-hidden="true" className="size-3" />
                Sede Central Ayacucho
              </span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1">
                <CalendarDays aria-hidden="true" className="size-3" />
                Periodo 2026-II
              </span>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 lg:pb-1">
          <a href="#informacion-personal" className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-md border border-border bg-card px-3 text-[10px] font-semibold text-foreground transition-colors hover:bg-muted sm:flex-none sm:text-[11px]">
            <PencilLine aria-hidden="true" className="size-3.5 text-primary" /> Editar perfil
          </a>
          <a href="#datos-institucionales" className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-md bg-secondary px-3 text-[10px] font-semibold text-secondary-foreground transition-opacity hover:opacity-90 sm:flex-none sm:text-[11px]">
            <Download aria-hidden="true" className="size-3.5" /> Descargar ficha
          </a>
        </div>
      </div>
      <nav aria-label="Secciones del perfil" className="flex gap-1 overflow-x-auto border-t border-border bg-muted/40 px-3 sm:px-5 lg:px-7">
        {profileSectionLinks.map(({ label, href, icon: Icon }, index) => (
          <a key={href} href={href} className={`inline-flex min-h-11 shrink-0 items-center gap-2 border-b-2 px-2 text-[10px] font-semibold transition-colors sm:px-3 sm:text-[11px] ${index === 0 ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
            <Icon aria-hidden="true" className="size-4" />
            {label}
          </a>
        ))}
      </nav>
    </section>
  </>
);

export { ProfileHeader };
