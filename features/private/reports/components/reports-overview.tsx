import type { JSX } from 'react';
import { BadgeCheck, GraduationCap, Monitor, ShieldCheck, Users } from 'lucide-react';
import type { ReportRow } from '../data/reports-data';

const ReportsOverview = ({ rows }: { rows: ReportRow[] }): JSX.Element => {
  const students = rows.reduce((sum, row) => sum + row.students, 0);
  const weighted = (key: 'attendance' | 'achievement'): number => (students ? rows.reduce((sum, row) => sum + row[key] * row.students, 0) / students : 0);
  const achievementCount = Math.round(rows.reduce((sum, row) => sum + (row.achievement / 100) * row.students, 0));
  const atRisk = rows.reduce((sum, row) => sum + row.atRisk, 0);
  const metrics = [
    { title: 'Matrícula oficial', value: String(students), detail: '100% FUM y nómina SIAGIE', foot: 'H: 48% · M: 52% · 15–54 años', icon: Users, tone: 'bg-primary/10 text-primary' },
    { title: 'Permanencia LMS', value: `${weighted('attendance').toFixed(1)}%`, detail: 'Tiempo sincrónico', foot: '4.6 horas por semana', icon: Monitor, tone: 'bg-secondary/10 text-secondary' },
    { title: 'Logro CNEB (A + AD)', value: `${weighted('achievement').toFixed(1)}%`, detail: `A/AD: ${achievementCount} estudiantes`, foot: 'B: 17.2% · C: 4.2%', icon: GraduationCap, tone: 'bg-accent text-primary' },
    { title: 'Eficacia docente', value: '45/45', detail: '100% de carga auxiliar', foot: '45 docentes evaluados', icon: BadgeCheck, tone: 'bg-secondary/10 text-secondary' },
    { title: 'Retención EBA', value: '96.8%', detail: `${atRisk} estudiantes en riesgo`, foot: '25 casos mitigados · tutoría activa', icon: ShieldCheck, tone: 'bg-chart-3/10 text-chart-3' },
  ];

  return (
    <section aria-label="Indicadores institucionales" className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
      {metrics.map(({ title, value, detail, foot, icon: Icon, tone }) => (
        <article key={title} className="min-w-0 rounded-lg border border-border bg-card p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[8px] font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
              <p className="mt-2 wrap-break-word font-heading text-2xl font-bold leading-none tabular-nums text-foreground">{value}</p>
            </div>
            <span className={`grid size-8 shrink-0 place-items-center rounded-md ${tone}`}>
              <Icon aria-hidden="true" className="size-4" />
            </span>
          </div>
          <p className="mt-3 text-[9px] font-semibold text-secondary">{detail}</p>
          <p className="mt-1 text-[8px] leading-4 text-muted-foreground">{foot}</p>
        </article>
      ))}
    </section>
  );
};

export { ReportsOverview };
