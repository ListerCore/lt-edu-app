import type { JSX } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, HeartPulse } from 'lucide-react';

const EnrollmentTrend = (): JSX.Element => (
  <section className="min-w-0 rounded-lg border border-border bg-card p-4 sm:p-5 lg:col-span-2">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="font-heading text-sm font-bold text-foreground">Tendencia de Matrícula y Retención Mensual</h2>
        <p className="mt-1 text-[9px] text-muted-foreground">Histórico mensual comparativo de permanencia 2026-I vs. 2026-II</p>
      </div>
      <div className="flex gap-3 text-[8px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <i className="size-2 rounded-full bg-primary" />
          Avanzado
        </span>
        <span className="flex items-center gap-1">
          <i className="size-2 rounded-full bg-secondary" />
          Intermedio
        </span>
        <span className="flex items-center gap-1">
          <i className="size-2 rounded-full bg-chart-2" />
          Inicial
        </span>
      </div>
    </div>
    <div className="mt-3 overflow-hidden">
      <svg role="img" aria-label="Tendencia mensual de matrícula y retención de mayo a octubre" viewBox="0 0 760 210" className="h-44 w-full sm:h-52">
        <title>Tendencia de matrícula y retención mensual</title>
        <defs>
          <linearGradient id="advanced-area" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="currentColor" stopOpacity=".18" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="intermediate-area" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="currentColor" stopOpacity=".12" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g className="text-border" stroke="currentColor" strokeDasharray="2 4">
          <path d="M30 35H740" />
          <path d="M30 85H740" />
          <path d="M30 135H740" />
          <path d="M30 185H740" />
        </g>
        <path d="M30 160 C120 145 155 120 220 111 S340 70 385 67 S510 41 560 35 S680 27 740 24 L740 185 L30 185Z" className="fill-primary/10" />
        <path d="M30 174 C105 160 168 148 220 133 S325 111 385 101 S510 82 560 78 S670 70 740 65 L740 185 L30 185Z" className="fill-secondary/10" />
        <path d="M30 160 C120 145 155 120 220 111 S340 70 385 67 S510 41 560 35 S680 27 740 24" fill="none" className="stroke-primary" strokeWidth="3" />
        <path d="M30 174 C105 160 168 148 220 133 S325 111 385 101 S510 82 560 78 S670 70 740 65" fill="none" className="stroke-secondary" strokeWidth="3" />
        {[
          [30, 160],
          [220, 111],
          [385, 67],
          [560, 35],
          [740, 24],
          [30, 174],
          [220, 133],
          [385, 101],
          [560, 78],
          [740, 65],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="3.5" className="fill-primary stroke-card" strokeWidth="2" />
        ))}
        <g className="fill-muted-foreground" fontSize="9">
          <text x="30" y="204">
            Mayo
          </text>
          <text x="160" y="204">
            Junio
          </text>
          <text x="290" y="204">
            Julio
          </text>
          <text x="420" y="204">
            Agosto
          </text>
          <text x="550" y="204">
            Septiembre
          </text>
          <text x="680" y="204">
            Octubre
          </text>
        </g>
      </svg>
    </div>
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-accent/50 px-3 py-2 text-[8px]">
      <span className="flex items-center gap-1.5 font-semibold text-secondary">
        <ArrowUpRight aria-hidden="true" className="size-3.5" />
        Tasa de retención general acumulada: 96.7%
      </span>
      <span className="text-muted-foreground">Meta institucional cumplida al 104%</span>
    </div>
  </section>
);

const PreventivePanel = (): JSX.Element => (
  <section className="min-w-0 rounded-lg border border-border bg-card p-4 sm:p-5">
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <HeartPulse aria-hidden="true" className="size-4 text-primary" />
        <h2 className="font-heading text-sm font-bold text-foreground">IA Preventiva</h2>
      </div>
      <span className="rounded-full bg-secondary/10 px-2 py-1 text-[8px] font-bold text-secondary">Motor activo</span>
    </div>
    <p className="mt-1 text-[9px] text-muted-foreground">Intervenciones automatizadas para mitigación de deserción escolar EBA</p>
    <div className="mt-3 rounded-md bg-accent/50 p-2.5">
      <div className="flex justify-between gap-2 text-[8px]">
        <span className="text-muted-foreground">Notificaciones WhatsApp enviadas</span>
        <b className="text-foreground">38 / 38</b>
      </div>
      <p className="mt-1 text-[8px] text-muted-foreground">Activadas por inactividad virtual superior a 48 horas</p>
    </div>
    <p className="mb-2 mt-3 text-[8px] font-bold uppercase tracking-wide text-muted-foreground">Casos críticos en monitoreo</p>
    <div className="space-y-2">
      {[
        ['Quispe A., Maritza', 'Avanzado 3.° · 72 h sin conexión', 'En llamada', 'red'],
        ['Mendoza T., Carlos', 'Intermedio 2.° · turno laboral', 'Reprogramado', 'green'],
        ['Huamán C., Elizabeth', 'Avanzado 1.° · conectividad', 'Plan offline', 'amber'],
      ].map(([name, detail, status, tone]) => (
        <div key={name} className="flex items-center gap-2 rounded-md bg-accent/40 p-2">
          <span className={`size-1.5 shrink-0 rounded-full ${tone === 'red' ? 'bg-destructive' : tone === 'amber' ? 'bg-chart-3' : 'bg-secondary'}`} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[8px] font-semibold text-foreground">{name}</p>
            <p className="truncate text-[7px] text-muted-foreground">{detail}</p>
          </div>
          <span className="rounded bg-card px-1.5 py-1 text-[7px] text-muted-foreground">{status}</span>
        </div>
      ))}
    </div>
    <Link href="/dashboard/alerts" className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-primary px-3 py-2.5 text-[9px] font-semibold text-primary-foreground">
      Derivar a Tutoría Integral <ArrowRight aria-hidden="true" className="size-3.5" />
    </Link>
  </section>
);

export { EnrollmentTrend, PreventivePanel };
