import type { JSX } from 'react';
import Link from 'next/link';
import { Activity, Banknote, Download, GraduationCap, HeartPulse, Users } from 'lucide-react';
import { AchievementScale, CurriculumPanel } from './dashboard-curriculum';
import { EnrollmentTrend, PreventivePanel } from './dashboard-analytics';
import { LiveClassrooms, OperationsPanel } from './dashboard-operations';
import { Metric } from './dashboard-metric';

const DashboardBody = (): JSX.Element => (
  <main className="min-w-0 flex-1">
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4 px-4 py-4 sm:gap-5 sm:px-6 sm:py-6 lg:px-8">
      <section className="relative overflow-hidden rounded-lg border border-primary/30 bg-primary px-4 py-5 text-primary-foreground sm:px-6 sm:py-6">
        <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-24 size-64 rounded-full border border-primary-foreground/10" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-2 -top-16 size-44 rounded-full border border-primary-foreground/10" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap gap-2 text-[8px] font-semibold">
              <span className="rounded-full bg-secondary px-2.5 py-1 text-secondary-foreground">● Periodo activo · 2026-II</span>
              <span className="rounded-full bg-primary-foreground/10 px-2.5 py-1">SIAGIE MINEDU · 98.4% sincronizado</span>
              <span className="rounded-full bg-primary-foreground/10 px-2.5 py-1">Conexión virtual hoy · 94.2%</span>
            </div>
            <h1 className="mt-3 font-heading text-2xl font-bold tracking-tight sm:text-3xl">Bienvenido, Lic. Fernando Prado M.</h1>
            <p className="mt-1 max-w-2xl text-[10px] leading-5 text-primary-foreground/75">Supervisión integral en tiempo real del CEBA Privado Virtual Joseph Lister · Periodo Académico 2026-II · Sede Regional Ayacucho (UGEL Huamanga).</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Link href="/dashboard/reports" className="inline-flex h-9 items-center gap-2 rounded-md bg-primary-foreground px-3 text-[9px] font-bold text-primary hover:bg-primary-foreground/90">
              <Download aria-hidden="true" className="size-3.5" />
              Reporte MINEDU
            </Link>
            <Link href="/dashboard/enrollment" className="inline-flex h-9 items-center gap-2 rounded-md bg-secondary px-3 text-[9px] font-bold text-secondary-foreground hover:opacity-90">
              <Users aria-hidden="true" className="size-3.5" />
              Nueva matrícula
            </Link>
          </div>
        </div>
      </section>

      <section aria-label="Indicadores ejecutivos del periodo" className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        <Metric label="Estudiantes EBA" value="1,485" detail="+12% vs. periodo anterior" icon={Users} accent="bg-accent text-primary" footer="Ini. 180 · Int. 420 · Av. 885" />
        <Metric label="Asistencia virtual" value="94.2%" detail="Óptimo · sesiones síncronas + asíncronas" icon={Activity} accent="bg-secondary/10 text-secondary" footer="Actualizado hoy" />
        <Metric label="Rendimiento (AD/A)" value="86.8%" detail="Logro esperado o destacado" icon={GraduationCap} accent="bg-accent text-primary" footer="AD 24% · A 62.8% · B 11.2% · C 2%" />
        <Metric label="Recaudación 2026-II" value="S/ 218.4k" detail="91.5% de la meta establecida" icon={Banknote} accent="bg-chart-3/10 text-chart-3" footer="Morosidad controlada · 8.5%" />
        <Metric label="Alertas tempranas IA" value="14" detail="Estudiantes requieren seguimiento" icon={HeartPulse} accent="bg-destructive/10 text-destructive" footer="9 casos con intervención activa" />
      </section>

      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(18rem,.78fr)]">
        <CurriculumPanel />
        <AchievementScale />
      </section>
      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(18rem,.78fr)]">
        <div className="grid min-w-0 gap-4">
          <EnrollmentTrend />
          <LiveClassrooms />
        </div>
        <PreventivePanel />
      </section>
      <OperationsPanel />
      <footer className="flex flex-col items-start justify-between gap-1 border-t border-border pt-3 text-[9px] text-muted-foreground sm:flex-row sm:items-center">
        <span>CEBA Privado Virtual Joseph Lister · Sede Ayacucho</span>
        <span>Datos institucionales de demostración · SIGE-JL 2026-II</span>
      </footer>
    </div>
  </main>
);

export { DashboardBody };
