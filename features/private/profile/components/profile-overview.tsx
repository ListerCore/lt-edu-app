import type { JSX } from 'react';
import Link from 'next/link';
import { ArrowRight, Bell, CheckCircle2, Mail, MessageSquare, Settings2, ShieldCheck } from 'lucide-react';
import { profileChecklist } from '../data/profile-data';
import { ProfileSaveButton } from './profile-save-button';

const ProfileCompletion = (): JSX.Element => (
  <section aria-labelledby="completion-heading" className="rounded-xl border border-border bg-card p-4 sm:p-5">
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <CheckCircle2 aria-hidden="true" className="size-5 text-secondary" />
        <h2 id="completion-heading" className="font-heading text-sm font-bold text-foreground">
          Completitud del perfil
        </h2>
      </div>
      <span className="font-mono text-xs font-bold text-secondary">75%</span>
    </div>
    <p className="mt-2 text-[10px] leading-5 text-muted-foreground">Completa tus datos de contacto para mantener actualizado tu registro institucional.</p>
    <div role="progressbar" aria-label="Completitud del perfil" aria-valuemin={0} aria-valuemax={100} aria-valuenow={75} className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
      <div className="h-full w-3/4 rounded-full bg-secondary" />
    </div>
    <ul className="mt-4 space-y-2">
      {profileChecklist.map(({ label, complete }) => (
        <li key={label} className="flex min-h-9 items-center justify-between gap-3 rounded-md border border-border px-2.5 py-1.5">
          <span className="flex min-w-0 items-center gap-2 text-[10px] text-foreground">
            <CheckCircle2 aria-hidden="true" className={`size-3.5 shrink-0 ${complete ? 'text-secondary' : 'text-muted-foreground'}`} />
            <span className="truncate">{label}</span>
          </span>
          <span className={`shrink-0 text-[9px] font-semibold ${complete ? 'text-muted-foreground' : 'text-primary'}`}>{complete ? 'Listo' : 'Completar'}</span>
        </li>
      ))}
    </ul>
  </section>
);

const RoleAccess = (): JSX.Element => (
  <section aria-labelledby="role-heading" className="rounded-xl border border-border bg-card p-4 sm:p-5">
    <div className="flex items-center gap-2.5">
      <Settings2 aria-hidden="true" className="size-5 text-primary" />
      <h2 id="role-heading" className="font-heading text-sm font-bold text-foreground">
        Acceso según tu rol
      </h2>
    </div>
    <p className="mt-3 text-[11px] leading-5 text-muted-foreground">Tu perfil de Promotor General cuenta con herramientas de supervisión y gestión institucional.</p>
    <div className="mt-4 rounded-lg border border-border bg-muted/40 p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="inline-flex items-center gap-2 text-xs font-bold text-primary">
          <ShieldCheck aria-hidden="true" className="size-4" /> Promotor General
        </p>
        <span className="rounded bg-secondary/10 px-1.5 py-1 text-[9px] font-bold text-secondary">ROL ACTIVO</span>
      </div>
      <p className="mt-2 text-[10px] leading-5 text-muted-foreground">Gestión académica, seguimiento de matrícula, reportes y configuración del CEBA.</p>
      <Link href="/dashboard/settings" className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-primary hover:underline">
        Ver configuración de accesos <ArrowRight aria-hidden="true" className="size-3" />
      </Link>
    </div>
  </section>
);

const NotificationSettings = (): JSX.Element => (
  <section id="notifications" aria-labelledby="notifications-heading" className="rounded-xl border border-border bg-card p-4 sm:p-5 lg:p-6">
    <div className="flex items-center gap-2.5">
      <Bell aria-hidden="true" className="size-5 text-secondary" />
      <h2 id="notifications-heading" className="font-heading text-sm font-bold text-foreground">
        Notificaciones
      </h2>
    </div>
    <p className="mt-2 text-[11px] leading-5 text-muted-foreground">Elige los canales por los que SIGE-JL te mantiene al tanto de cambios, recordatorios y actividad institucional.</p>
    <div className="mt-4 divide-y divide-border rounded-lg border border-border px-3">
      <div className="flex items-center justify-between gap-4 py-3">
        <div className="flex items-start gap-2.5">
          <Mail aria-hidden="true" className="mt-0.5 size-4 text-primary" />
          <div>
            <p className="text-xs font-semibold text-foreground">Correo institucional</p>
            <p className="mt-1 text-[10px] text-muted-foreground">Resumen diario y avisos importantes</p>
          </div>
        </div>
        <span className="rounded bg-secondary/10 px-2 py-1 text-[9px] font-bold text-secondary">ACTIVO</span>
      </div>
      <div className="flex items-center justify-between gap-4 py-3">
        <div className="flex items-start gap-2.5">
          <MessageSquare aria-hidden="true" className="mt-0.5 size-4 text-secondary" />
          <div>
            <p className="text-xs font-semibold text-foreground">Plataforma SIGE-JL</p>
            <p className="mt-1 text-[10px] text-muted-foreground">Alertas dentro del panel institucional</p>
          </div>
        </div>
        <span className="rounded bg-secondary/10 px-2 py-1 text-[9px] font-bold text-secondary">ACTIVO</span>
      </div>
      <div className="flex items-center justify-between gap-4 py-3">
        <div className="flex items-start gap-2.5">
          <Bell aria-hidden="true" className="mt-0.5 size-4 text-muted-foreground" />
          <div>
            <p className="text-xs font-semibold text-foreground">Avisos de periodo académico</p>
            <p className="mt-1 text-[10px] text-muted-foreground">Fechas, cierres y tareas de gestión</p>
          </div>
        </div>
        <span className="rounded bg-secondary/10 px-2 py-1 text-[9px] font-bold text-secondary">ACTIVO</span>
      </div>
    </div>
    <p className="mt-3 text-[9px] text-muted-foreground">Las preferencias de notificación se sincronizan con tu cuenta institucional.</p>
    <div className="mt-4 flex justify-end border-t border-border pt-4">
      <ProfileSaveButton />
    </div>
  </section>
);

const ProfileOverview = (): JSX.Element => (
  <aside className="flex min-w-0 flex-col gap-5 xl:col-span-5 xl:gap-6">
    <ProfileCompletion />
    <RoleAccess />
    <NotificationSettings />
  </aside>
);

export { NotificationSettings, ProfileCompletion, ProfileOverview, RoleAccess };
