'use client';

import type { JSX } from 'react';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, CalendarDays, CheckCircle2, ChevronRight, CloudUpload, FileSpreadsheet, FileText, ShieldCheck, Wifi } from 'lucide-react';
import { AttendanceChart, CompetencyChart, DemographyChart } from './reports-analytics';
import { ReportsDossier } from './reports-dossier';
import { defaultReportFilters, ReportsFilters, type ReportFiltersState } from './reports-filters';
import { ReportsMatrix } from './reports-matrix';
import { ReportsOverview } from './reports-overview';
import { competencyData, reportRows, reportTabs, type ReportTab } from '../data/reports-data';

const ReportsPage = (): JSX.Element => {
  const [filters, setFilters] = useState<ReportFiltersState>(defaultReportFilters);
  const [activeTab, setActiveTab] = useState<ReportTab>('consolidated');
  const [feedback, setFeedback] = useState('');
  const filteredRows = useMemo(() => reportRows.filter((row) => filters.grade === 'all' || (filters.grade === 'Avanzado' ? row.cycle === 'Avanzado' : filters.grade === row.grade || filters.grade === row.cycle)), [filters.grade]);
  const filteredCompetencies = filters.area === 'all' || competencyData.some(({ id }) => id === filters.area) ? filters.area : 'all';
  const updateFilter = (key: keyof ReportFiltersState, value: string): void => setFilters((current) => ({ ...current, [key]: value }));

  const downloadReport = (title: string, type = 'csv'): void => {
    if (type === 'pdf') {
      window.print();
      return;
    }
    const headings = ['Ciclo', 'Grado', 'Trayectoria', 'Secciones', 'Matrícula', 'Asistencia LMS', 'Logro AD/A', 'En riesgo', 'Coordinación', 'Estado SIAGIE'];
    const content = [headings, ...filteredRows.map((row) => [row.level, row.grade, row.track, row.sections, row.students, `${row.attendance}%`, `${row.achievement}%`, row.atRisk, row.coordinator, row.siagie])].map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${title.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    setFeedback(`Se preparó la descarga de ${title} en formato CSV compatible con Excel.`);
  };

  const renderTabContent = (): JSX.Element => {
    if (activeTab === 'demography')
      return (
        <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(19rem,0.8fr)]">
          <DemographyChart />
          <article className="rounded-lg border border-border bg-card p-4 sm:p-5">
            <h2 className="font-heading text-sm font-bold text-foreground">Caracterización de matrícula EBA</h2>
            <p className="mt-1 text-[9px] text-muted-foreground">Datos agregados para planificación y acompañamiento institucional.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                ['Matrícula oficial', '850', '100% registrada en FUM y nómina SIAGIE'],
                ['Mujeres', '442', '52% del padrón institucional'],
                ['Hombres', '408', '48% del padrón institucional'],
                ['Estudiantes trabajadores', '612', '72% con jornada laboral registrada'],
              ].map(([label, value, detail]) => (
                <div key={label} className="rounded-md bg-muted/50 p-3">
                  <p className="text-[8px] font-semibold uppercase text-muted-foreground">{label}</p>
                  <p className="mt-2 text-xl font-bold tabular-nums text-foreground">{value}</p>
                  <p className="mt-1 text-[8px] leading-4 text-muted-foreground">{detail}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 rounded-md bg-accent/60 p-3 text-[9px] leading-4 text-muted-foreground">Las medidas de flexibilidad horaria se aplican a estudiantes adultos trabajadores, según resolución institucional N.° 088-2026-JL.</p>
          </article>
        </section>
      );
    if (activeTab === 'attendance')
      return (
        <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
          <AttendanceChart />
          <article className="rounded-lg border border-border bg-card p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <ShieldCheck aria-hidden="true" className="size-4 text-secondary" />
              <h2 className="font-heading text-sm font-bold text-foreground">Seguimiento de permanencia</h2>
            </div>
            <p className="mt-1 text-[9px] text-muted-foreground">Acciones de tutoría y alertas del periodo.</p>
            <div className="mt-4 space-y-3">
              {[
                ['27', 'Estudiantes en riesgo', 'Casos con alertas de asistencia o participación'],
                ['25', 'Casos mitigados', 'Seguimiento tutorial activo'],
                ['36', 'En recuperación pedagógica', 'Requieren bitácora semanal de avance'],
              ].map(([value, title, detail]) => (
                <div key={title} className="flex items-start gap-3 rounded-md bg-muted/50 p-3">
                  <span className="font-heading text-xl font-bold tabular-nums text-primary">{value}</span>
                  <div>
                    <p className="text-[9px] font-semibold text-foreground">{title}</p>
                    <p className="mt-1 text-[8px] leading-4 text-muted-foreground">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>
      );
    if (activeTab === 'competencies')
      return (
        <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
          <CompetencyChart filter={filteredCompetencies} />
          <article className="rounded-lg border border-border bg-card p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <BadgeCheck aria-hidden="true" className="size-4 text-primary" />
              <h2 className="font-heading text-sm font-bold text-foreground">Criterios de evaluación CNEB</h2>
            </div>
            <p className="mt-1 text-[9px] text-muted-foreground">Lectura de niveles de logro para el consolidado oficial.</p>
            <div className="mt-4 space-y-3">
              {[
                ['AD', 'Logro destacado', 'Evidencia desempeño superior a lo esperado'],
                ['A', 'Logro esperado', 'Demuestra el nivel previsto de la competencia'],
                ['B', 'En proceso', 'Requiere acompañamiento para alcanzar el nivel'],
                ['C', 'En inicio', 'Necesita apoyo y nivelación pedagógica'],
              ].map(([grade, label, detail]) => (
                <div key={grade} className="flex items-start gap-3 border-b border-border pb-3 last:border-0">
                  <span className={`grid size-7 shrink-0 place-items-center rounded text-[10px] font-bold ${grade === 'C' ? 'bg-destructive/10 text-destructive' : grade === 'B' ? 'bg-chart-3/10 text-chart-3' : 'bg-secondary/10 text-secondary'}`}>{grade}</span>
                  <div>
                    <p className="text-[9px] font-semibold text-foreground">{label}</p>
                    <p className="mt-1 text-[8px] leading-4 text-muted-foreground">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>
      );
    if (activeTab === 'teachers')
      return (
        <section className="min-w-0 rounded-lg border border-border bg-card p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-heading text-sm font-bold text-foreground">Desempeño y carga docente</h2>
              <p className="mt-1 text-[9px] text-muted-foreground">Cumplimiento de carga auxiliar y acompañamiento de competencias.</p>
            </div>
            <span className="rounded bg-secondary/10 px-2 py-1 text-[9px] font-bold text-secondary">45 de 45 docentes evaluados</span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filteredRows.map((row) => (
              <article key={row.grade} className="rounded-md border border-border p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[9px] font-semibold text-foreground">{row.coordinator}</p>
                    <p className="mt-1 text-[8px] text-muted-foreground">{row.area}</p>
                  </div>
                  <BadgeCheck aria-hidden="true" className="size-4 shrink-0 text-secondary" />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded bg-muted/50 p-2">
                    <p className="text-[8px] text-muted-foreground">Carga registrada</p>
                    <p className="mt-1 text-xs font-bold text-foreground">100%</p>
                  </div>
                  <div className="rounded bg-muted/50 p-2">
                    <p className="text-[8px] text-muted-foreground">Secciones</p>
                    <p className="mt-1 text-xs font-bold text-foreground">{row.sections}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      );
    return (
      <>
        <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)]">
          <CompetencyChart filter={filteredCompetencies} />
          <DemographyChart />
        </section>
        <ReportsMatrix rows={filteredRows} />
        <ReportsDossier onExport={(title, kind): void => downloadReport(title, kind)} />
      </>
    );
  };

  return (
    <main className="mx-auto flex w-full max-w-[1600px] min-w-0 flex-col gap-4 px-4 py-5 sm:gap-5 sm:px-6 sm:py-6 lg:px-8">
      <div className="flex flex-wrap items-center gap-2 text-[9px] text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground">
          CEBA Joseph Lister
        </Link>
        <ChevronRight aria-hidden="true" className="size-3" />
        <span>Reportes y estadísticas</span>
        <ChevronRight aria-hidden="true" className="size-3" />
        <span className="font-semibold text-foreground">Consolidado institucional</span>
      </div>
      <section className="flex min-w-0 flex-col gap-4 rounded-lg border border-border bg-card p-4 sm:p-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[8px] font-bold text-primary">
              <BadgeCheck aria-hidden="true" className="size-3" />
              Formato de referencia MINEDU / SIAGIE
            </span>
            <span className="rounded bg-secondary/10 px-2.5 py-1 text-[8px] font-semibold text-secondary">Directiva DREA Ayacucho N.° 014-2026</span>
          </div>
          <h1 className="mt-3 max-w-4xl font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl lg:text-3xl">Reportes oficiales, indicadores y SIAGIE</h1>
          <p className="mt-2 max-w-3xl text-[10px] leading-5 text-muted-foreground">Consolidado de matrícula, permanencia virtual y calificación por competencias CNEB para seguimiento institucional y revisión UGEL Huamanga.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-muted/40 px-3 text-[9px] font-semibold text-foreground">
            <CalendarDays aria-hidden="true" className="size-3.5 text-primary" />
            {filters.period === 'annual' ? 'Anual 2026' : filters.period === '2026-I' ? '2026-I Regular' : filters.period === 'recovery' ? 'Recuperación' : '2026-II Promocional'}
          </span>
          <button type="button" onClick={(): void => downloadReport('consolidado-institucional')} className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-[9px] font-semibold text-foreground hover:bg-muted">
            <FileSpreadsheet aria-hidden="true" className="size-3.5 text-secondary" />
            Exportar Excel
          </button>
          <button type="button" onClick={(): void => downloadReport('dossier-institucional', 'pdf')} className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-[9px] font-semibold text-primary-foreground hover:opacity-90">
            <FileText aria-hidden="true" className="size-3.5" />
            Dossier PDF
          </button>
          <button type="button" onClick={(): void => setFeedback('Transmisión de prueba preparada. El envío requiere conectar el servicio SIAGIE institucional.')} className="inline-flex h-9 items-center gap-1.5 rounded-md bg-secondary px-3 text-[9px] font-semibold text-secondary-foreground hover:opacity-90">
            <CloudUpload aria-hidden="true" className="size-3.5" />
            Transmitir a SIAGIE
          </button>
        </div>
      </section>
      {feedback && (
        <div role="status" className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-secondary/20 bg-secondary/10 px-3 py-2 text-[9px] font-medium text-secondary">
          <span className="inline-flex items-center gap-2">
            <CheckCircle2 aria-hidden="true" className="size-3.5" />
            {feedback}
          </span>
          <button type="button" onClick={(): void => setFeedback('')} className="text-secondary hover:underline">
            Cerrar
          </button>
        </div>
      )}
      <ReportsFilters filters={filters} onChange={updateFilter} onReset={(): void => setFilters(defaultReportFilters)} />
      <ReportsOverview rows={filteredRows} />
      <section aria-label="Vistas de reportes" className="min-w-0 overflow-hidden rounded-lg border border-border bg-card">
        <div role="tablist" aria-label="Secciones de reportes" className="flex gap-1 overflow-x-auto border-b border-border px-2">
          {reportTabs.map(({ id, label }) => (
            <button key={id} type="button" role="tab" aria-selected={activeTab === id} aria-controls="report-tabpanel" onClick={(): void => setActiveTab(id)} className={`min-h-11 shrink-0 border-b-2 px-3 text-[9px] font-semibold transition-colors sm:px-4 sm:text-[10px] ${activeTab === id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
              {label}
            </button>
          ))}
        </div>
        <div id="report-tabpanel" role="tabpanel" className="min-w-0 p-3 sm:p-4">
          {renderTabContent()}
        </div>
      </section>
      <section className="flex min-w-0 flex-col gap-3 rounded-lg bg-primary p-4 text-primary-foreground sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex min-w-0 items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-md bg-primary-foreground/10">
            <Wifi aria-hidden="true" className="size-4 text-secondary" />
          </span>
          <div className="min-w-0">
            <p className="flex flex-wrap items-center gap-2 text-[10px] font-bold">
              WebService MINEDU · SIAGIE{' '}
              <span className="inline-flex items-center gap-1 rounded bg-secondary px-1.5 py-0.5 text-[8px] text-secondary-foreground">
                <span className="size-1.5 rounded-full bg-secondary-foreground" />
                Online 99.9%
              </span>
            </p>
            <p className="mt-1 text-[8px] leading-4 text-primary-foreground/70">Última sincronización de nóminas y actas: hoy, 18:42 · Token DREA vigente por 72 horas.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={(): void => setFeedback('Registro de transmisiones SIAGIE disponible al conectar el servicio institucional.')} className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary-foreground/10 px-3 text-[8px] font-semibold hover:bg-primary-foreground/20">
            <FileText aria-hidden="true" className="size-3" />
            Ver logs de transmisión
          </button>
          <button type="button" onClick={(): void => setFeedback('Verificación CNEB simulada. El enlace con SIAGIE requiere credenciales de servicio.')} className="inline-flex h-8 items-center gap-1.5 rounded-md bg-secondary px-3 text-[8px] font-bold text-secondary-foreground hover:opacity-90">
            <CheckCircle2 aria-hidden="true" className="size-3" />
            Verificar CNEB
          </button>
        </div>
      </section>
      <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-[9px] text-muted-foreground">
        <span>CEBA Privado Virtual Joseph Lister · Reportes institucionales</span>
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck aria-hidden="true" className="size-3" />
          Cifras de referencia · periodo 2026-II
          <ArrowRight aria-hidden="true" className="ml-1 size-3" />
        </span>
      </footer>
    </main>
  );
};

export { ReportsPage };
