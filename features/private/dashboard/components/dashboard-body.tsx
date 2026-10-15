import type { JSX } from 'react';
import Link from 'next/link';
import { ArrowDownRight, ArrowRight, ArrowUpRight, BookOpen, CircleAlert, GraduationCap, Users, Wallet } from 'lucide-react';
import type { DashboardMetric } from '../types';

const metrics: DashboardMetric[] = [
  { label: 'Estudiantes matriculados', value: '1,485', detail: '+12% frente al periodo anterior', icon: 'users', tone: 'blue' },
  { label: 'Asistencia virtual', value: '94.2%', detail: 'Óptimo · última actualización hoy', icon: 'attendance', tone: 'green' },
  { label: 'Rendimiento académico', value: '86.8%', detail: 'Logro esperado o destacado', icon: 'grade', tone: 'blue' },
  { label: 'Recaudación del periodo', value: 'S/ 218.4k', detail: '91.5% de la meta establecida', icon: 'payments', tone: 'amber' },
];

const DashboardBody = (): JSX.Element => (
  <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-5 px-4 py-5 sm:gap-6 sm:px-6 sm:py-6 lg:px-8">
    <section className="relative overflow-hidden rounded-xl bg-primary px-4 py-6 text-primary-foreground sm:px-6 sm:py-8 lg:px-8">
      <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-28 size-80 rounded-full border border-primary-foreground/10" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-4 -top-16 size-56 rounded-full border border-primary-foreground/10" />
      <div className="relative max-w-3xl">
        <div className="mb-4 flex flex-wrap items-center gap-2 text-[11px] font-semibold">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-secondary-foreground">
            <span className="size-1.5 animate-pulse rounded-full bg-secondary-foreground" />
            Periodo activo · 2026-II
          </span>
          <span className="rounded-full bg-primary-foreground/10 px-3 py-1.5 text-primary-foreground/80">Sede Central Ayacucho</span>
        </div>
        <p className="text-sm text-primary-foreground/75">Miércoles, 15 de octubre de 2026</p>
        <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl">Bienvenido, Fernando</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-primary-foreground/75">Este es el resumen de hoy en CEBA Privado Virtual Joseph Lister. Revisa el avance académico y las actividades pendientes de tu institución.</p>
        <Link href="/dashboard/students" className="mt-6 inline-flex h-10 items-center gap-2 rounded-md bg-primary-foreground px-4 text-xs font-bold text-primary transition-colors hover:bg-primary-foreground/90">
          Ver estudiantes <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </section>

    <section aria-label="Indicadores institucionales" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = metric.icon === 'users' ? Users : metric.icon === 'attendance' ? GraduationCap : metric.icon === 'grade' ? BookOpen : Wallet;
        const tone = metric.tone === 'green' ? 'bg-secondary/10 text-secondary' : metric.tone === 'amber' ? 'bg-chart-3/10 text-chart-3' : 'bg-accent text-primary';
        return (
          <article key={metric.label} className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-semibold text-muted-foreground">{metric.label}</p>
              <span className={`flex size-9 items-center justify-center rounded-md ${tone}`}>
                <Icon aria-hidden="true" className="size-4.5" />
              </span>
            </div>
            <p className="mt-5 font-heading text-[28px] font-bold leading-none tracking-tight text-foreground">{metric.value}</p>
            <p className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <ArrowUpRight aria-hidden="true" className="size-3.5 text-secondary" />
              {metric.detail}
            </p>
          </article>
        );
      })}
    </section>

    <section className="grid gap-4 xl:grid-cols-[1.45fr_1fr]">
      <article className="rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="font-heading text-base font-bold text-foreground">Matrícula por ciclo</h2>
            <p className="mt-1 text-xs text-muted-foreground">Distribución de estudiantes · periodo 2026-II</p>
          </div>
          <button type="button" className="text-xs font-semibold text-primary hover:underline">
            Ver reporte
          </button>
        </div>
        <div className="space-y-5 p-5">
          {[
            ['Avanzado', '885', '60%', 'bg-primary'],
            ['Intermedio', '420', '28%', 'bg-secondary'],
            ['Inicial', '180', '12%', 'bg-chart-2'],
          ].map(([label, count, percent, color]) => (
            <div key={label} className="grid grid-cols-[6rem_1fr_3rem] items-center gap-4">
              <div>
                <p className="text-xs font-semibold text-card-foreground">{label}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{count} estudiantes</p>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className={`h-full rounded-full ${color}`} style={{ width: percent }} />
              </div>
              <span className="text-right text-xs font-semibold tabular-nums text-muted-foreground">{percent}</span>
            </div>
          ))}
        </div>
      </article>
      <article className="rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="font-heading text-base font-bold text-foreground">Requiere atención</h2>
            <p className="mt-1 text-xs text-muted-foreground">Seguimiento de esta semana</p>
          </div>
          <span className="flex size-8 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <CircleAlert aria-hidden="true" className="size-4" />
          </span>
        </div>
        <div className="divide-y divide-border px-5">
          {[
            ['Matrículas por completar', '12 expedientes pendientes', 'Hoy'],
            ['Alertas de seguimiento', '14 estudiantes identificados', 'Ayer'],
            ['Sincronización SIAGIE', 'Última actualización exitosa', '09:42'],
          ].map(([title, description, time], index) => (
            <div key={title} className="flex items-center gap-3 py-4">
              <span className={`size-2 shrink-0 rounded-full ${index === 1 ? 'bg-chart-3' : 'bg-secondary'}`} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-card-foreground">{title}</p>
                <p className="mt-1 truncate text-[11px] text-muted-foreground">{description}</p>
              </div>
              <span className="text-[10px] text-muted-foreground">{time}</span>
            </div>
          ))}
        </div>
        <Link href="/dashboard/alerts" className="flex items-center justify-between border-t border-border px-5 py-3 text-xs font-semibold text-primary hover:bg-muted">
          Revisar alertas <ArrowRight aria-hidden="true" className="size-3.5" />
        </Link>
      </article>
    </section>

    <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
      {[
        { title: 'Gestión académica', detail: 'Consulta ciclos, aulas y expedientes.', Icon: BookOpen, href: '/dashboard/academics' },
        { title: 'Comunidad educativa', detail: 'Encuentra estudiantes y docentes.', Icon: Users, href: '/dashboard/students' },
        { title: 'Tendencia de ingresos', detail: 'Revisa pagos y recaudación institucional.', Icon: Wallet, href: '/dashboard/finance' },
      ].map(({ title, detail, Icon, href }) => (
        <Link key={title} href={href} className="group flex items-center gap-4 rounded-lg border border-border bg-card p-5 transition-colors hover:border-ring hover:bg-accent/40">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-primary">
            <Icon aria-hidden="true" className="size-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold text-foreground">{title}</span>
            <span className="mt-1 block text-xs leading-5 text-muted-foreground">{detail}</span>
          </span>
          <ArrowDownRight aria-hidden="true" className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
        </Link>
      ))}
    </section>
    <div className="flex flex-col items-start gap-2 border-t border-border pt-4 text-[10px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
      <span>CEBA Privado Virtual Joseph Lister · Sede Ayacucho</span>
      <span>Datos de demostración</span>
    </div>
  </div>
);

export { DashboardBody };
