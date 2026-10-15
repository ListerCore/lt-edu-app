import type { JSX } from 'react';
import { CheckCircle2, Clock3, HardDrive, History } from 'lucide-react';

const metrics = [
  { label: 'Último respaldo exitoso', value: 'Hoy, 03:00 AM', detail: 'Auto diario · 4.8 GB', status: 'Íntegro y verificado', icon: CheckCircle2, tone: 'text-secondary bg-secondary/10' },
  { label: 'Próximo respaldo', value: 'Hoy, 23:00 hrs', detail: 'Ventana nocturna', status: 'Programado', icon: Clock3, tone: 'text-primary bg-accent' },
  { label: 'Almacenamiento seguro', value: '42.6 GB', detail: 'de 200 GB asignados', status: '21.3% ocupado', icon: HardDrive, tone: 'text-primary bg-accent' },
  { label: 'Puntos de restauración', value: '28 snapshots', detail: 'Política activa', status: '30 días de retención', icon: History, tone: 'text-secondary bg-secondary/10' },
];

const BackupMetrics = (): JSX.Element => (
  <section aria-label="Estado de los respaldos" className="grid min-w-0 gap-3 sm:grid-cols-2 2xl:grid-cols-4">
    {metrics.map(({ label, value, detail, status, icon: Icon, tone }) => (
      <article key={label} className="min-w-0 rounded-lg border border-border bg-card p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
            <p className="mt-2 wrap-break-word font-heading text-xl font-bold leading-tight tracking-tight text-foreground sm:text-2xl">{value}</p>
          </div>
          <span className={`grid size-9 shrink-0 place-items-center rounded-md ${tone}`}>
            <Icon aria-hidden="true" className="size-4.5" />
          </span>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-md bg-muted/50 px-2.5 py-2">
          <span className="text-[9px] text-muted-foreground">{detail}</span>
          <span className="text-[8px] font-semibold text-secondary">{status}</span>
        </div>
        {label === 'Almacenamiento seguro' && (
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-[21.3%] rounded-full bg-primary" />
          </div>
        )}
      </article>
    ))}
  </section>
);

export { BackupMetrics };
