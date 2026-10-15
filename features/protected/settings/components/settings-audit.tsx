import type { JSX } from 'react';
import { FileDown, History, Monitor, ShieldCheck, UserRound } from 'lucide-react';

const events = [
  { title: 'Inicio de sesión verificado', actor: 'Lic. Fernando Prado M. · Promotor General', time: 'Hoy, 09:42 a. m.', icon: UserRound, status: 'Correcto' },
  { title: 'Consulta de padrón institucional', actor: 'Mg. Miriam Quispe Huamán · Coordinación', time: 'Hoy, 08:15 a. m.', icon: Monitor, status: 'Correcto' },
  { title: 'Política de acceso aplicada', actor: 'Sistema SIGE-JL · Seguridad', time: 'Ayer, 06:00 p. m.', icon: ShieldCheck, status: 'Automático' },
];

const SettingsAudit = (): JSX.Element => (
  <section id="audit-logs" aria-labelledby="audit-heading" className="min-w-0 scroll-mt-32 overflow-hidden rounded-lg border border-border bg-card p-4 sm:p-5">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <div className="flex items-center gap-2">
          <History aria-hidden="true" className="size-4 text-primary" />
          <h2 id="audit-heading" className="font-heading text-xs font-bold text-foreground sm:text-sm">
            Registro de auditoría
          </h2>
        </div>
        <p className="mt-1 text-[9px] text-muted-foreground">Trazabilidad reciente de accesos y cambios administrativos.</p>
      </div>
      <button type="button" className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border px-2.5 text-[9px] font-semibold text-foreground hover:bg-muted">
        <FileDown aria-hidden="true" className="size-3.5" /> Exportar auditoría
      </button>
    </div>
    <div className="mt-3 divide-y divide-border">
      {events.map(({ title, actor, time, icon: Icon, status }) => (
        <article key={title} className="grid min-w-0 grid-cols-[2rem_minmax(0,1fr)] items-center gap-x-3 gap-y-2 py-3 sm:grid-cols-[2rem_minmax(0,1fr)_auto_auto]">
          <span className="row-span-2 flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-primary sm:row-span-1">
            <Icon aria-hidden="true" className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="wrap-break-word text-[10px] font-semibold text-foreground">{title}</p>
            <p className="mt-0.5 wrap-break-word text-[9px] text-muted-foreground">{actor}</p>
          </div>
          <time className="col-start-2 text-[9px] text-muted-foreground sm:col-start-auto">{time}</time>
          <span className="col-start-2 w-fit rounded-full bg-secondary/10 px-2 py-1 text-[8px] font-semibold text-secondary sm:col-start-auto">{status}</span>
        </article>
      ))}
    </div>
  </section>
);

export { SettingsAudit };
