import type { JSX } from 'react';
import Link from 'next/link';
import { Activity, ArrowRight, BookOpen, ShieldCheck } from 'lucide-react';
import { profileActivity } from '../data/profile-data';
import { ProfileSaveButton } from './profile-save-button';

const ProfileActivity = (): JSX.Element => (
  <section id="activity" aria-labelledby="activity-heading" className="rounded-xl border border-border bg-card p-4 sm:p-5 lg:p-6">
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4">
      <div className="flex items-center gap-2.5">
        <Activity aria-hidden="true" className="size-5 text-primary" />
        <h2 id="activity-heading" className="font-heading text-sm font-bold text-foreground">
          Actividad reciente
        </h2>
      </div>
      <span className="text-[9px] font-medium text-muted-foreground">Registro institucional</span>
    </div>
    <p className="mb-4 text-[11px] leading-5 text-muted-foreground">Revisa los últimos movimientos realizados desde tu cuenta institucional.</p>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {profileActivity.map(({ title, description, time, icon: Icon }) => (
        <div key={title} className="flex min-w-0 items-start gap-3 rounded-lg border border-border p-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-primary">
            <Icon aria-hidden="true" className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold text-foreground">{title}</p>
            <p className="mt-1 truncate text-[9px] text-muted-foreground">{description}</p>
            <time className="mt-2 block text-[9px] text-muted-foreground">{time}</time>
          </div>
        </div>
      ))}
    </div>
    <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
      <button type="button" className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-[10px] font-semibold text-foreground hover:bg-muted">
        Ver registro completo <ArrowRight aria-hidden="true" className="size-3.5" />
      </button>
      <ProfileSaveButton />
    </div>
  </section>
);

const ProfilePreferences = (): JSX.Element => (
  <section aria-labelledby="preferences-heading" className="grid gap-4 rounded-xl border border-border bg-card p-4 sm:grid-cols-2 sm:p-5 lg:p-6">
    <div>
      <div className="flex items-center gap-2.5">
        <BookOpen aria-hidden="true" className="size-5 text-primary" />
        <h2 id="preferences-heading" className="font-heading text-sm font-bold text-foreground">
          Configuración de visualización
        </h2>
      </div>
      <p className="mt-2 text-[10px] leading-5 text-muted-foreground">Preferencias regionales de tu espacio institucional.</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-md bg-muted/70 p-2.5">
          <p className="text-[9px] text-muted-foreground">Idioma</p>
          <p className="mt-1 text-[10px] font-semibold text-foreground">Español (Perú)</p>
        </div>
        <div className="rounded-md bg-muted/70 p-2.5">
          <p className="text-[9px] text-muted-foreground">Zona horaria</p>
          <p className="mt-1 text-[10px] font-semibold text-foreground">GMT−5 · Lima</p>
        </div>
      </div>
      <Link href="/dashboard/settings" className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-primary hover:underline">
        Administrar preferencias <ArrowRight aria-hidden="true" className="size-3" />
      </Link>
      <div className="mt-4 flex justify-end border-t border-border pt-4">
        <ProfileSaveButton />
      </div>
    </div>
    <div className="rounded-lg border border-border bg-muted/40 p-3.5">
      <div className="flex items-center gap-2.5">
        <ShieldCheck aria-hidden="true" className="size-5 text-secondary" />
        <h2 className="font-heading text-sm font-bold text-foreground">Privacidad y datos personales</h2>
      </div>
      <p className="mt-2 text-[10px] leading-5 text-muted-foreground">El tratamiento de datos se realiza conforme a la Ley N.º 29733 de Protección de Datos Personales del Perú.</p>
      <Link href="/legal/privacy" className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-primary hover:underline">
        Consultar política de privacidad <ArrowRight aria-hidden="true" className="size-3" />
      </Link>
    </div>
  </section>
);

const ProfileActivityAndPreferences = (): JSX.Element => (
  <>
    <ProfileActivity />
    <ProfilePreferences />
  </>
);

export { ProfileActivity, ProfileActivityAndPreferences, ProfilePreferences };
