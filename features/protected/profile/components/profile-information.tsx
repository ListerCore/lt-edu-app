import type { JSX } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, CheckCircle2, IdCard, LockKeyhole, PencilLine, ShieldCheck, Users } from 'lucide-react';
import { personalFields } from '../data/profile-data';
import type { ProfileField } from '../types';
import { ProfileSaveButton } from './profile-save-button';

const ProfileFieldView = ({ label, value, verified = false }: ProfileField): JSX.Element => (
  <div className="min-w-0 space-y-1.5">
    <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
    <div className="flex min-h-10 min-w-0 items-center justify-between gap-2 rounded-md bg-muted/70 px-3 py-2">
      <p className="min-w-0 wrap-break-word text-xs font-medium text-foreground">{value}</p>
      {verified && (
        <span className="inline-flex shrink-0 items-center gap-1 rounded bg-secondary/10 px-1.5 py-1 text-[9px] font-bold text-secondary">
          <Check aria-hidden="true" className="size-3" /> Verificado
        </span>
      )}
    </div>
  </div>
);

const PersonalInformation = (): JSX.Element => (
  <section id="personal-information" aria-labelledby="personal-heading" className="rounded-xl border border-border bg-card p-4 sm:p-5 lg:p-6">
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
      <div className="flex items-center gap-2.5">
        <IdCard aria-hidden="true" className="size-5 text-primary" />
        <h2 id="personal-heading" className="font-heading text-sm font-bold text-foreground">
          Información personal
        </h2>
      </div>
      <button type="button" className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-primary hover:underline">
        <PencilLine aria-hidden="true" className="size-3.5" /> Modificar campos
      </button>
    </div>
    <p className="mb-4 text-[11px] leading-5 text-muted-foreground">Revisa los datos de contacto y la información asociada a tu cuenta. Mantener estos datos actualizados facilita las comunicaciones institucionales.</p>
    <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2">
      {personalFields.map((field) => (
        <ProfileFieldView key={field.label} {...field} />
      ))}
    </div>
    <div className="mt-5 flex justify-end border-t border-border pt-4">
      <ProfileSaveButton />
    </div>
  </section>
);

const InstitutionalData = (): JSX.Element => (
  <section id="institutional-data" aria-labelledby="institution-heading" className="rounded-xl border border-border bg-card p-4 sm:p-5 lg:p-6">
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4">
      <div className="flex items-center gap-2.5">
        <Users aria-hidden="true" className="size-5 text-secondary" />
        <h2 id="institution-heading" className="font-heading text-sm font-bold text-foreground">
          Datos institucionales
        </h2>
      </div>
      <span className="text-[9px] font-medium text-muted-foreground">Cuenta activa · 2026-II</span>
    </div>
    <p className="mb-4 text-[11px] leading-5 text-muted-foreground">Información del vínculo laboral e institucional y el ámbito de acceso asignado a tu usuario.</p>
    <div className="grid gap-3 sm:grid-cols-2">
      {[
        ['Cargo', 'Promotor General'],
        ['Institución', 'CEBA Privado Virtual Joseph Lister'],
        ['Sede y región', 'Ayacucho · Huamanga'],
        ['Periodo vigente', '2026-II'],
        ['Código institucional', 'SIGE-JL · PG-001'],
      ].map(([label, value]) => (
        <div key={label} className="rounded-lg border border-border bg-muted/40 p-3">
          <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
          <p className="mt-1 text-xs font-semibold text-foreground">{value}</p>
        </div>
      ))}
      <div className="rounded-lg border border-border bg-muted/40 p-3">
        <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Acceso al sistema</p>
        <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-secondary">
          <CheckCircle2 aria-hidden="true" className="size-3.5" /> Verificado
        </p>
      </div>
    </div>
    <div className="mt-5 flex justify-end border-t border-border pt-4">
      <ProfileSaveButton />
    </div>
  </section>
);

const SecurityInformation = (): JSX.Element => (
  <section id="security" aria-labelledby="security-heading" className="rounded-xl border border-border bg-card p-4 sm:p-5 lg:p-6">
    <div className="mb-4 flex items-center gap-2.5 border-b border-border pb-4">
      <LockKeyhole aria-hidden="true" className="size-5 text-primary" />
      <h2 id="security-heading" className="font-heading text-sm font-bold text-foreground">
        Seguridad de la cuenta
      </h2>
    </div>
    <p className="mb-4 text-[11px] leading-5 text-muted-foreground">Administra tus credenciales y revisa las medidas activas para proteger el acceso institucional.</p>
    <div className="divide-y divide-border rounded-lg border border-border px-3">
      <div className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold text-foreground">Contraseña de acceso</p>
          <p className="mt-1 text-[10px] text-muted-foreground">Actualiza tu contraseña periódicamente.</p>
        </div>
        <Link href="/auth/password/setup" className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md border border-border px-3 text-[10px] font-semibold text-foreground transition-colors hover:bg-muted sm:w-auto">
          Actualizar contraseña <ArrowRight aria-hidden="true" className="size-3.5" />
        </Link>
      </div>
      <div className="flex items-center justify-between gap-3 py-3">
        <div>
          <p className="text-xs font-semibold text-foreground">Verificación de dos pasos</p>
          <p className="mt-1 text-[10px] text-muted-foreground">Añade una capa extra al iniciar sesión.</p>
        </div>
        <span className="rounded bg-muted px-2 py-1 text-[9px] font-semibold text-muted-foreground">No configurada</span>
      </div>
      <div className="flex items-center justify-between gap-3 py-3">
        <div>
          <p className="text-xs font-semibold text-foreground">Sesión actual</p>
          <p className="mt-1 text-[10px] text-muted-foreground">Este dispositivo · Actividad reciente</p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[9px] font-semibold text-secondary">
          <span className="size-1.5 rounded-full bg-secondary" /> Activa
        </span>
      </div>
    </div>
    <div className="mt-4 flex items-start gap-3 rounded-lg bg-muted/50 p-3">
      <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-secondary" />
      <p className="text-[10px] leading-5 text-muted-foreground">Tu cuenta está protegida por los controles de acceso institucionales de SIGE-JL.</p>
    </div>
    <div className="mt-5 flex justify-end border-t border-border pt-4">
      <ProfileSaveButton />
    </div>
  </section>
);

const ProfileInformation = (): JSX.Element => (
  <div className="flex min-w-0 flex-col gap-5 xl:col-span-7 xl:gap-6">
    <PersonalInformation />
    <InstitutionalData />
    <SecurityInformation />
  </div>
);

export { InstitutionalData, PersonalInformation, ProfileInformation, SecurityInformation };
