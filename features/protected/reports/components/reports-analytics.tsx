import type { JSX } from 'react';
import { BadgeCheck, Download, Info, Users, Wifi } from 'lucide-react';
import { ageGroups, competencyData } from '../data/reports-data';

const CompetencyChart = ({ filter }: { filter: string }): JSX.Element => {
  const areas = filter === 'all' ? competencyData : competencyData.filter(({ id }) => id === filter);

  return (
    <article className="min-w-0 rounded-lg border border-border bg-card p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-heading text-sm font-bold text-foreground">Niveles de logro CNEB por campo</h2>
          <p className="mt-1 text-[9px] text-muted-foreground">Evaluación formativa bimestral · periodo 2026-II</p>
        </div>
        <div className="flex flex-wrap gap-2 text-[8px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <span className="size-2 rounded-full bg-secondary" />
            AD/A
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="size-2 rounded-full bg-chart-3" />B
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="size-2 rounded-full bg-destructive" />C
          </span>
        </div>
      </div>
      <div className="mt-4 space-y-4">
        {areas.map(({ id, area, detail, achieved, developing, beginning }) => (
          <div key={id} className="min-w-0">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <p className="min-w-0 text-[9px] font-semibold text-foreground">
                {area}
                <span className="font-normal text-muted-foreground"> · {detail}</span>
              </p>
              <p className="shrink-0 text-[8px] tabular-nums text-muted-foreground">
                {achieved}% / {developing}% / {beginning}%
              </p>
            </div>
            <div aria-label={`${area}: ${achieved}% AD/A, ${developing}% B, ${beginning}% C`} className="mt-2 flex h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-secondary" style={{ width: `${achieved}%` }} />
              <div className="h-full bg-chart-3" style={{ width: `${developing}%` }} />
              <div className="h-full bg-destructive" style={{ width: `${beginning}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-3 border-t border-border pt-3">
        <p className="flex max-w-xl items-start gap-2 text-[8px] leading-4 text-muted-foreground">
          <Info aria-hidden="true" className="mt-0.5 size-3 shrink-0 text-primary" />
          Los estudiantes en nivel C cuentan con bitácora de nivelación semanal obligatoria.
        </p>
        <button type="button" onClick={(): void => window.print()} className="inline-flex items-center gap-1 text-[9px] font-bold text-primary hover:underline">
          Informe pedagógico <Download aria-hidden="true" className="size-3" />
        </button>
      </div>
    </article>
  );
};

const DemographyChart = (): JSX.Element => (
  <article className="flex min-w-0 flex-col rounded-lg border border-border bg-card p-4 sm:p-5">
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0">
        <h2 className="font-heading text-sm font-bold text-foreground">Distribución etaria y laboral EBA</h2>
        <p className="mt-1 text-[9px] text-muted-foreground">Población estudiantil de Huamanga · 850 estudiantes</p>
      </div>
      <span className="rounded bg-accent px-2 py-1 text-[8px] font-semibold text-primary">Directiva DREA</span>
    </div>
    <div className="mt-5 space-y-4">
      {ageGroups.map(({ label, percent, students }) => (
        <div key={label} className="grid grid-cols-[5.5rem_minmax(0,1fr)_4rem] items-center gap-2">
          <span className="text-[8px] text-muted-foreground">{label}</span>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
          </div>
          <span className="text-right text-[8px] font-semibold tabular-nums text-foreground">
            {percent}% <span className="font-normal text-muted-foreground">({students})</span>
          </span>
        </div>
      ))}
    </div>
    <div className="mt-5 rounded-md bg-accent/60 p-3">
      <p className="flex items-center gap-2 text-[9px] font-semibold text-primary">
        <Users aria-hidden="true" className="size-3.5" />
        612 estudiantes trabajadores · 72%
      </p>
      <p className="mt-1 text-[8px] leading-4 text-muted-foreground">Con horarios asincrónicos flexibles avalados por la Resolución Directoral Institucional N.° 088-2026-JL.</p>
    </div>
    <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
      <span className="inline-flex items-center gap-1 text-[8px] text-muted-foreground">
        <BadgeCheck aria-hidden="true" className="size-3 text-secondary" />
        Validado con padrón RENIEC / SIAGIE
      </span>
      <button type="button" onClick={(): void => window.print()} className="inline-flex items-center gap-1 text-[8px] font-semibold text-primary hover:underline">
        <Download aria-hidden="true" className="size-3" />
        Exportar
      </button>
    </div>
  </article>
);

const AttendanceChart = (): JSX.Element => (
  <article className="rounded-lg border border-border bg-card p-4 sm:p-5">
    <div className="flex items-center gap-2">
      <Wifi aria-hidden="true" className="size-4 text-secondary" />
      <h2 className="font-heading text-sm font-bold text-foreground">Asistencia y permanencia virtual</h2>
    </div>
    <p className="mt-1 text-[9px] text-muted-foreground">Conexión registrada por ciclo · promedio institucional 91.4%</p>
    <div className="mt-5 space-y-4">
      {[
        { label: 'Avanzado 4°', value: 93.8 },
        { label: 'Avanzado 3°', value: 92.1 },
        { label: 'Avanzado 2°', value: 89.6 },
        { label: 'Avanzado 1°', value: 88.5 },
        { label: 'Intermedio', value: 91 },
        { label: 'Inicial', value: 86.2 },
      ].map(({ label, value }) => (
        <div key={label} className="grid grid-cols-[6rem_minmax(0,1fr)_3rem] items-center gap-3">
          <span className="text-[9px] text-muted-foreground">{label}</span>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-secondary" style={{ width: `${value}%` }} />
          </div>
          <span className="text-right text-[9px] font-semibold tabular-nums text-foreground">{value}%</span>
        </div>
      ))}
    </div>
    <div className="mt-5 grid gap-3 border-t border-border pt-4 sm:grid-cols-3">
      <div>
        <p className="text-[8px] text-muted-foreground">Tiempo sincrónico</p>
        <p className="mt-1 text-sm font-bold text-foreground">4.6 h/sem</p>
      </div>
      <div>
        <p className="text-[8px] text-muted-foreground">Permanencia LMS</p>
        <p className="mt-1 text-sm font-bold text-secondary">91.4%</p>
      </div>
      <div>
        <p className="text-[8px] text-muted-foreground">Riesgo de abandono</p>
        <p className="mt-1 text-sm font-bold text-chart-3">27 casos</p>
      </div>
    </div>
  </article>
);

export { AttendanceChart, CompetencyChart, DemographyChart };
