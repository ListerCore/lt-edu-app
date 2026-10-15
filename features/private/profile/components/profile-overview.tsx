import type { JSX } from 'react';
import Link from 'next/link';
import { ArrowRight, Bell, CheckCircle2, Mail, MessageSquare, Settings2, ShieldCheck } from 'lucide-react';
import { profileChecklist } from '../data/profile-data';

const ProfileOverview = (): JSX.Element => (
  <aside className="flex min-w-0 flex-col gap-5 xl:col-span-5 xl:gap-6">
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
      <div role="progressbar" aria-label="Completitud del perfil" aria-valuemin={0} aria-valuemax={100} aria-valuenow={75} className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
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

    <section id="notificaciones" aria-labelledby="notifications-heading" className="scroll-mt-24 rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className="flex items-center gap-2.5">
        <Bell aria-hidden="true" className="size-5 text-secondary" />
        <h2 id="notifications-heading" className="font-heading text-sm font-bold text-foreground">
          Notificaciones
        </h2>
      </div>
      <p className="mt-2 text-[10px] leading-5 text-muted-foreground">Recibe avisos institucionales y alertas importantes del periodo académico.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1.5 text-[9px] font-semibold text-foreground">
          <Mail aria-hidden="true" className="size-3.5 text-primary" /> Correo institucional
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1.5 text-[9px] font-semibold text-foreground">
          <MessageSquare aria-hidden="true" className="size-3.5 text-secondary" /> Plataforma SIGE-JL
        </span>
      </div>
    </section>
  </aside>
);

export { ProfileOverview };
