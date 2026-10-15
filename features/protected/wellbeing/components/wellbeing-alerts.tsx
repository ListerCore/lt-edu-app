import type { JSX } from 'react';
import { Activity, CalendarDays, MessageCircle, SignalLow, Sparkles } from 'lucide-react';

const alerts = [
  { id: 'silvia', kind: 'Crítica · 5 días sin conexión', time: 'Hace 2 horas', name: 'Silvia Cárdenas Palomino', detail: 'DNI 74819203 · 2.° Avanzado B. Sin actividad en plataforma desde el 19/10. Turno laboral nocturno en Huamanga.', suggestion: 'Citar para flexibilización asíncrona y reprogramar evidencias para el domingo.', icon: Activity, tone: 'border-destructive/30 bg-destructive/5', badge: 'bg-destructive/10 text-destructive' },
  { id: 'edwin', kind: 'Participación síncrona < 60%', time: 'Ayer', name: 'Edwin Mendoza Alarcón', detail: 'DNI 46193021 · 3.° Avanzado A. Asistencia a sesiones en vivo bajo el umbral durante las últimas dos semanas.', suggestion: 'Enviar resumen audiovisual breve y validar tutoría entre pares.', icon: Activity, tone: 'border-chart-3/30 bg-chart-3/5', badge: 'bg-chart-3/10 text-chart-3' },
  { id: 'brayan', kind: 'Conectividad limitada', time: 'Hace 1 día', name: 'Brayan Quispe Sulca', detail: 'DNI 70349182 · 1.° Avanzado C. Agotó sus datos móviles durante faenas agrícolas en Huanta.', suggestion: 'Preparar guías descargables y recepción diferida de tareas.', icon: SignalLow, tone: 'border-primary/20 bg-accent/40', badge: 'bg-primary/10 text-primary' },
];

const WellbeingAlerts = ({ onAction, onSelect }: { onAction: (message: string) => void; onSelect: (id: string) => void }): JSX.Element => (
  <section aria-labelledby="wellbeing-alerts-heading" className="min-w-0 rounded-lg border border-border bg-card p-4 sm:p-5">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <Sparkles aria-hidden="true" className="size-4 text-primary" />
          <h2 id="wellbeing-alerts-heading" className="font-heading text-sm font-bold text-foreground">
            Alertas tempranas de deserción y desconexión
          </h2>
        </div>
        <p className="mt-1 text-[9px] text-muted-foreground">Señales de actividad, asistencia y entrega de portafolio.</p>
      </div>
      <span className="rounded bg-secondary/10 px-2 py-1 text-[8px] font-semibold text-secondary">Motor predictivo v2.4</span>
    </div>
    <div className="mt-4 grid min-w-0 gap-3 xl:grid-cols-3">
      {alerts.map(({ id, kind, time, name, detail, suggestion, icon: Icon, tone, badge }) => (
        <article key={id} className={`min-w-0 rounded-md border p-3 ${tone}`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className={`inline-flex items-center gap-1 rounded px-1.5 py-1 text-[8px] font-bold ${badge}`}>
              <Icon aria-hidden="true" className="size-3" />
              {kind}
            </span>
            <span className="text-[8px] text-muted-foreground">{time}</span>
          </div>
          <h3 className="mt-3 text-[10px] font-bold text-foreground">{name}</h3>
          <p className="mt-1 min-h-12 text-[8px] leading-4 text-muted-foreground">{detail}</p>
          <div className="mt-2 rounded bg-background/70 p-2">
            <p className="text-[8px] font-semibold text-primary">Sugerencia de acompañamiento</p>
            <p className="mt-1 text-[8px] leading-4 text-muted-foreground">{suggestion}</p>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <button type="button" onClick={(): void => onAction(`Cita preparada para ${name}.`)} className="inline-flex h-7 items-center gap-1 rounded bg-primary px-2 text-[8px] font-semibold text-primary-foreground">
              <CalendarDays aria-hidden="true" className="size-3" />
              Agendar cita
            </button>
            <button type="button" onClick={(): void => onAction(`Mensaje de tutoría preparado para ${name}.`)} className="inline-flex h-7 items-center gap-1 rounded bg-secondary/10 px-2 text-[8px] font-semibold text-secondary">
              <MessageCircle aria-hidden="true" className="size-3" />
              WhatsApp
            </button>
            <button type="button" onClick={(): void => onSelect(id)} className="ml-auto h-7 rounded px-2 text-[8px] font-semibold text-muted-foreground hover:bg-background">
              Ver ficha
            </button>
          </div>
        </article>
      ))}
    </div>
  </section>
);

export { WellbeingAlerts };
