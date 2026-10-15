'use client';

import type { JSX } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Badge, ExtraPanel } from './workspace-reference-ui';

const StudentsProfilePanels = ({ onAction }: { onAction: (value: string) => void }): JSX.Element => (
  <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(18rem,.8fr)]">
    <ExtraPanel title="Ficha integral del estudiante · Juan Pérez Huamán">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">JP</span>
          <div>
            <h3 className="text-[11px] font-bold text-foreground">Juan Pérez Huamán</h3>
            <p className="mt-1 text-[8px] text-muted-foreground">DNI 47829103 · 24 años · Ayacucho</p>
            <p className="mt-1 text-[8px] text-muted-foreground">Ciclo Avanzado · 2.° Grado Modular · 2026-II</p>
          </div>
        </div>
        <Badge tone="green">Matrícula activa</Badge>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {[
          ['Modalidad', '100% virtual asíncrona'],
          ['Sede operativa', 'Ayacucho · DREA'],
          ['Código modular', 'EBA-2026-0842'],
        ].map((x) => (
          <div key={x[0]} className="rounded-md bg-accent/40 p-2.5">
            <p className="text-[8px] text-muted-foreground">{x[0]}</p>
            <p className="mt-1 text-[9px] font-semibold text-foreground">{x[1]}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={(): void => onAction('Ver expediente completo')} className="rounded-md bg-primary px-3 py-2 text-[9px] font-semibold text-primary-foreground">
          Ver expediente completo
        </button>
        <button onClick={(): void => onAction('Descargar FUM digital')} className="rounded-md border border-border px-3 py-2 text-[9px] font-semibold text-foreground">
          Descargar FUM digital
        </button>
        <button onClick={(): void => onAction('Enviar constancia de matrícula')} className="rounded-md bg-accent px-3 py-2 text-[9px] font-semibold text-primary">
          Constancia de matrícula
        </button>
      </div>
    </ExtraPanel>
    <ExtraPanel title="Progreso académico por áreas">
      <div className="space-y-3">
        {[
          ['Matemática funcional', 'A', '88%'],
          ['Comunicación', 'AD', '94%'],
          ['Ciencia, Tecnología y Salud', 'A', '82%'],
          ['Desarrollo Personal y Ciudadano', 'B', '68%'],
          ['Educación para el Trabajo', 'A', '85%'],
        ].map((x) => (
          <div key={x[0]}>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[8px] font-medium text-foreground">{x[0]}</span>
              <Badge tone={x[1] === 'AD' ? 'green' : x[1] === 'B' ? 'amber' : 'blue'}>
                {x[1]} · {x[2]}
              </Badge>
            </div>
            <div className="mt-1.5 h-1.5 rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary" style={{ width: x[2] }} />
            </div>
          </div>
        ))}
      </div>
      <button onClick={(): void => onAction('Abrir libreta de calificaciones')} className="mt-4 text-[9px] font-semibold text-primary">
        Consultar libreta de calificaciones <ArrowRight className="ml-1 inline size-3" />
      </button>
    </ExtraPanel>
    <ExtraPanel title="Expediente digital normado · 4 de 4 conformes">
      <div className="space-y-2">
        {[
          ['Copia DNI vigente · RENIEC validado', 'Validado'],
          ['Certificado oficial de estudios EBR', 'Visado'],
          ['Ficha Única de Matrícula (FUM)', 'Firmada digitalmente'],
          ['Acta de evaluación de ubicación', 'Calificación 16.5 · A'],
        ].map((x) => (
          <div key={x[0]} className="flex items-center gap-2 rounded-md bg-accent/40 p-2.5">
            <CheckCircle2 className="size-3.5 shrink-0 text-secondary" />
            <p className="min-w-0 flex-1 text-[8px] font-medium text-foreground">{x[0]}</p>
            <span className="text-[7px] font-semibold text-secondary">{x[1]}</span>
          </div>
        ))}
      </div>
      <button onClick={(): void => onAction('Cargar documento al expediente')} className="mt-3 w-full rounded-md border border-dashed border-border p-2.5 text-[8px] font-semibold text-muted-foreground">
        + Cargar documento
      </button>
    </ExtraPanel>
    <ExtraPanel title="Asistencia, permanencia y acompañamiento">
      <div className="grid grid-cols-3 gap-2">
        {[
          ['Asistencia', '96.4%'],
          ['Campus LMS', '92 min'],
          ['Riesgo de retiro', 'Bajo'],
        ].map((x) => (
          <div key={x[0]} className="rounded-md bg-accent/40 p-2">
            <p className="text-[7px] text-muted-foreground">{x[0]}</p>
            <p className="mt-1 text-[9px] font-bold text-foreground">{x[1]}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 border-l border-border pl-3">
        <p className="text-[8px] font-semibold text-foreground">Último seguimiento · 14 octubre</p>
        <p className="mt-1 text-[8px] leading-4 text-muted-foreground">Participó en la sesión de Matemática funcional y entregó la práctica de presupuesto familiar.</p>
      </div>
      <button onClick={(): void => onAction('Registrar seguimiento de tutoría')} className="mt-3 rounded-md bg-accent px-3 py-2 text-[8px] font-semibold text-primary">
        Registrar seguimiento
      </button>
    </ExtraPanel>
    <ExtraPanel title="Trayectoria académica">
      <div className="space-y-3 border-l border-border pl-4">
        {[
          ['2022 · Ayacucho', 'Interrupción de estudios en 2.° de secundaria EBR'],
          ['Julio 2026 · SIGE-JL', 'Preinscripción virtual y solicitud de convalidación EBA'],
          ['05 agosto 2026', 'Evaluación de ubicación aprobada · 16.5 (A)'],
          ['18 agosto 2026 · Actual', 'Matrícula confirmada en nómina oficial SIAGIE 2026-II'],
        ].map((x) => (
          <div key={x[0]} className="relative">
            <span className="absolute left-[1.27rem] top-1 size-2 rounded-full bg-primary" />
            <p className="text-[8px] font-bold text-primary">{x[0]}</p>
            <p className="mt-1 text-[8px] leading-4 text-muted-foreground">{x[1]}</p>
          </div>
        ))}
      </div>
    </ExtraPanel>
  </div>
);

export { StudentsProfilePanels };
