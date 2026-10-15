import type { JSX } from 'react';
import { Activity, CircleAlert, HeartHandshake, ShieldCheck, Users } from 'lucide-react';

const metrics = [
  { label: 'Carga asignada', value: '42', detail: 'Estudiantes en acompañamiento', foot: '100% con diagnóstico socioemocional', icon: Users, color: 'text-primary bg-accent' },
  { label: 'Riesgo crítico', value: '4', detail: 'Inasistencia > 4 días / sin evidencias', foot: 'Requieren contacto prioritario', icon: CircleAlert, color: 'text-destructive bg-destructive/10' },
  { label: 'Riesgo moderado', value: '7', detail: 'Tardanzas y calificaciones B/C', foot: 'Conectividad o cruce laboral', icon: Activity, color: 'text-chart-3 bg-chart-3/10' },
  { label: 'Estables / bajo riesgo', value: '31', detail: 'Asistencia > 85% / ritmo óptimo', foot: 'Participación activa en aulas', icon: ShieldCheck, color: 'text-secondary bg-secondary/10' },
  { label: 'Atención mensual', value: '26', detail: '94.2% retención institucional', foot: '18 virtuales · 8 presenciales / telefónicas', icon: HeartHandshake, color: 'text-primary bg-accent' },
];

const WellbeingOverview = (): JSX.Element => (
  <section aria-label="Indicadores de tutoría y bienestar" className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
    {metrics.map(({ label, value, detail, foot, icon: Icon, color }) => (
      <article key={label} className="min-w-0 rounded-lg border border-border bg-card p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[8px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
            <p className="mt-2 text-2xl font-bold tabular-nums text-foreground">{value}</p>
          </div>
          <span className={`grid size-8 shrink-0 place-items-center rounded-md ${color}`}>
            <Icon aria-hidden="true" className="size-4" />
          </span>
        </div>
        <p className="mt-3 text-[9px] font-semibold text-foreground">{detail}</p>
        <p className="mt-1 text-[8px] leading-4 text-muted-foreground">{foot}</p>
      </article>
    ))}
  </section>
);

export { WellbeingOverview };
