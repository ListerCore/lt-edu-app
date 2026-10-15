import type { JSX } from 'react';
import { Activity, Fingerprint, Radio, ShieldAlert, Users } from 'lucide-react';

const metrics = [
  { title: 'Padrón digital SIGE', value: '932', detail: 'Cuentas institucionales activas', icon: Users, tone: 'text-primary bg-primary/10', extra: '850 estudiantes · 45 docentes' },
  { title: 'Sesiones en vivo (24 h)', value: '142', detail: 'Tráfico en Aula Virtual y SIGE', icon: Radio, tone: 'text-secondary bg-secondary/10', extra: 'Actividad dentro de lo esperado' },
  { title: 'Defensa brute-force', value: '3', detail: 'IPs bloqueadas por geofence', icon: ShieldAlert, tone: 'text-destructive bg-destructive/10', extra: 'Último bloqueo · 185.220.101.4' },
  { title: 'Cumplimiento 2FA personal', value: '100%', detail: '59 / 59 colaboradores activos', icon: Fingerprint, tone: 'text-secondary bg-secondary/10', extra: 'Auditoría al día' },
];

const SettingsOverview = (): JSX.Element => (
  <section aria-label="Indicadores de identidad y seguridad" className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
    {metrics.map(({ title, value, detail, icon: Icon, tone, extra }) => (
      <article key={title} className="rounded-lg border border-border bg-card p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
            <p className="mt-3 font-heading text-3xl font-bold leading-none tracking-tight text-foreground">{value}</p>
          </div>
          <span className={`flex size-9 shrink-0 items-center justify-center rounded-md ${tone}`}>
            <Icon aria-hidden="true" className="size-4.5" />
          </span>
        </div>
        <p className="mt-3 text-[10px] text-foreground">{detail}</p>
        <p className="mt-2 truncate text-[9px] text-muted-foreground">
          <Activity aria-hidden="true" className="mr-1 inline size-3" />
          {extra}
        </p>
      </article>
    ))}
  </section>
);

export { SettingsOverview };
