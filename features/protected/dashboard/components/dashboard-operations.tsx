import type { JSX } from 'react';
import Link from 'next/link';
import { ArrowRight, Download, FileCheck2, Landmark, Wallet } from 'lucide-react';

const LiveClassrooms = (): JSX.Element => (
  <section className="min-w-0 rounded-lg border border-border bg-card">
    <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3.5 sm:px-5">
      <div>
        <h2 className="font-heading text-sm font-bold text-foreground">Monitoreo de Aulas Virtuales en Vivo</h2>
        <p className="mt-1 text-[9px] text-muted-foreground">Sesiones académicas concurrentes y flujo de estudiantes en plataforma</p>
      </div>
      <span className="rounded-full bg-secondary/10 px-2.5 py-1 text-[8px] font-semibold text-secondary">● 6 aulas activas en tiempo real</span>
    </header>
    <div className="overflow-x-auto">
      <table className="w-full min-w-175 text-left text-[9px]">
        <thead className="bg-accent/50 text-[8px] uppercase tracking-wide text-muted-foreground">
          <tr>
            {['Docente facilitador', 'Ciclo y grado', 'Área curricular', 'Conectados', 'Modalidad', 'Acción'].map((h) => (
              <th key={h} className="px-3 py-2.5 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {[
            ['LP', 'Mg. Luis Paucar Gutiérrez', 'Ciclo Avanzado · 4.° Grado', 'Desarrollo Personal y Ciudadano', '42 alumnos', 'En vivo · Zoom EBA'],
            ['YA', 'Lic. Yessica Alanya Rojas', 'Ciclo Avanzado · 2.° Grado', 'Ciencia, Tecnología y Salud', '38 alumnos', 'En vivo · Zoom EBA'],
            ['RC', 'Prof. Raúl Condori Quispe', 'Ciclo Intermedio · 3.° Grado', 'Educación para el Trabajo', '29 asincrónicos', 'Taller grabado'],
            ['SM', 'Mg. Sonia Morales Cárdenas', 'Ciclo Inicial · 1.° y 2.° Grado', 'Matemática Funcional', '21 alumnos', 'En vivo · Zoom EBA'],
          ].map(([initials, name, grade, area, count, mode]) => (
            <tr key={name}>
              <td className="px-3 py-3">
                <span className="mr-2 inline-grid size-6 place-items-center rounded-full bg-accent text-[8px] font-bold text-primary">{initials}</span>
                <span className="font-semibold text-foreground">{name}</span>
              </td>
              <td className="px-3 py-3 text-muted-foreground">{grade}</td>
              <td className="px-3 py-3 text-foreground">{area}</td>
              <td className="px-3 py-3">
                <span className="rounded-full bg-secondary/10 px-2 py-1 text-[8px] font-semibold text-secondary">{count}</span>
              </td>
              <td className="px-3 py-3 text-muted-foreground">{mode}</td>
              <td className="px-3 py-3">
                <Link href="/dashboard/classrooms" className="rounded bg-accent px-2 py-1.5 text-[8px] font-semibold text-primary">
                  Supervisar
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

const OperationsPanel = (): JSX.Element => (
  <section className="grid min-w-0 gap-3 md:grid-cols-3">
    <article className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <FileCheck2 aria-hidden="true" className="size-4 text-primary" />
        <h2 className="text-[11px] font-bold text-foreground">Expedientes Digitales</h2>
      </div>
      <p className="mt-1 text-[9px] text-muted-foreground">Control de legalidad de matrícula según normas DRE Ayacucho</p>
      <div className="mt-3 space-y-1.5">
        {[
          ['DNI / Pasaporte validados', '99.1%'],
          ['Certificados de estudios previos', '94.8%'],
          ['Actas de convalidación', '100%'],
        ].map(([a, b]) => (
          <div key={a} className="flex justify-between gap-2 rounded bg-accent/40 px-2 py-1.5 text-[8px]">
            <span className="text-foreground">{a}</span>
            <b className="text-secondary">{b}</b>
          </div>
        ))}
      </div>
      <Link href="/dashboard/enrollment" className="mt-3 flex items-center justify-between rounded bg-accent px-2.5 py-2 text-[8px] font-semibold text-primary">
        Auditar 28 expedientes pendientes <ArrowRight className="size-3" />
      </Link>
    </article>
    <article className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <Landmark aria-hidden="true" className="size-4 text-secondary" />
        <h2 className="text-[11px] font-bold text-foreground">Reportes UGEL &amp; SIAGIE</h2>
      </div>
      <p className="mt-1 text-[9px] text-muted-foreground">Paquetes documentarios listos para firma y derivación</p>
      <div className="mt-3 space-y-1.5">
        {['Nóminas de Matrícula Adicional 2026-II', 'Actas de Evaluación Bimestral', 'Informe Estadístico DREA · EBA'].map((label) => (
          <button key={label} className="flex w-full items-center justify-between gap-2 rounded bg-accent/40 px-2 py-2 text-left text-[8px] text-foreground">
            <span>{label}</span>
            <Download aria-hidden="true" className="size-3 shrink-0 text-primary" />
          </button>
        ))}
      </div>
      <Link href="/dashboard/reports" className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-primary px-2.5 py-2 text-[8px] font-semibold text-primary-foreground">
        Generar XML para SIAGIE MINEDU <ArrowRight className="size-3" />
      </Link>
    </article>
    <article className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <Wallet aria-hidden="true" className="size-4 text-primary" />
        <h2 className="text-[11px] font-bold text-foreground">Pasarela y Tesorería</h2>
      </div>
      <p className="mt-1 text-[9px] text-muted-foreground">Conciliación automática en tiempo real de pensiones EBA</p>
      <div className="mt-3 space-y-1.5">
        {[
          ['BCP & Interbank · Telecrédito', 'En línea · 99.9%'],
          ['BBVA Recaudación Virtual', 'En línea'],
          ['Yape & Plin institucional', 'Activo · flujo 48%'],
        ].map(([a, b]) => (
          <div key={a} className="flex items-center justify-between gap-2 rounded bg-accent/40 px-2 py-2 text-[8px]">
            <span className="text-foreground">{a}</span>
            <span className="shrink-0 text-secondary">● {b}</span>
          </div>
        ))}
      </div>
      <Link href="/dashboard/finance" className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-accent px-2.5 py-2 text-[8px] font-semibold text-primary">
        Conciliar caja del día <ArrowRight className="size-3" />
      </Link>
    </article>
  </section>
);

export { LiveClassrooms, OperationsPanel };
