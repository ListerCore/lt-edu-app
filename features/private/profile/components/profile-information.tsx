import type { JSX } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, CheckCircle2, IdCard, LockKeyhole, PencilLine, ShieldCheck, Users } from 'lucide-react';
import { personalFields } from '../data/profile-data';
import type { ProfileField } from '../types';

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

const ProfileInformation = (): JSX.Element => (
  <div className="flex min-w-0 flex-col gap-5 xl:col-span-7 xl:gap-6">
    <section id="informacion-personal" aria-labelledby="personal-heading" className="scroll-mt-24 rounded-xl border border-border bg-card p-4 sm:p-5 lg:p-6">
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
      <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2">
        {personalFields.map((field) => (
          <ProfileFieldView key={field.label} {...field} />
        ))}
      </div>
    </section>

    <section id="datos-institucionales" aria-labelledby="institution-heading" className="scroll-mt-24 rounded-xl border border-border bg-card p-4 sm:p-5 lg:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4">
        <div className="flex items-center gap-2.5">
          <Users aria-hidden="true" className="size-5 text-secondary" />
          <h2 id="institution-heading" className="font-heading text-sm font-bold text-foreground">
            Datos institucionales
          </h2>
        </div>
        <span className="text-[9px] font-medium text-muted-foreground">Cuenta activa · 2026-II</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          ['Cargo', 'Promotor General'],
          ['Institución', 'CEBA Privado Virtual Joseph Lister'],
          ['Sede y región', 'Ayacucho · Huamanga'],
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
    </section>

    <section id="seguridad" aria-labelledby="security-heading" className="scroll-mt-24 rounded-xl border border-border bg-card p-4 sm:p-5 lg:p-6">
      <div className="mb-4 flex items-center gap-2.5 border-b border-border pb-4">
        <LockKeyhole aria-hidden="true" className="size-5 text-primary" />
        <h2 id="security-heading" className="font-heading text-sm font-bold text-foreground">
          Seguridad de la cuenta
        </h2>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold text-foreground">Contraseña de acceso</p>
          <p className="mt-1 text-[10px] text-muted-foreground">Actualiza tus credenciales para proteger tu cuenta institucional.</p>
        </div>
        <Link href="/auth/password/setup" className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md border border-border px-3 text-[10px] font-semibold text-foreground transition-colors hover:bg-muted sm:w-auto">
          Actualizar contraseña <ArrowRight aria-hidden="true" className="size-3.5" />
        </Link>
      </div>
      <div className="mt-4 flex items-start gap-3 rounded-lg bg-muted/50 p-3">
        <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-secondary" />
        <p className="text-[10px] leading-5 text-muted-foreground">Tu cuenta está protegida por los controles de acceso institucionales de SIGE-JL.</p>
      </div>
    </section>
  </div>
);

export { ProfileInformation };
