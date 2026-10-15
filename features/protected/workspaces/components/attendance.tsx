'use client';

import type { JSX } from 'react';
import { Download, MessageCircle } from 'lucide-react';
import { Badge, ExtraPanel } from './workspace-reference-ui';

const AttendanceReferencePanels = ({ onAction }: { onAction: (value: string) => void }): JSX.Element => (
  <div className="grid min-w-0 gap-4 xl:grid-cols-2">
    <ExtraPanel title="Monitoreo de actividad en Campus Virtual · últimas 48 horas">
      <div className="space-y-2">
        {[
          ['Sesiones iniciadas', '1,206 estudiantes · 81.2%'],
          ['Entregas de actividades', '684 evidencias registradas'],
          ['Inactividad mayor a 24 h', '14 estudiantes identificados'],
          ['Permanencia media en vivo', '76 de 90 minutos'],
        ].map((x) => (
          <div key={x[0]} className="flex items-center justify-between gap-3 rounded-md bg-accent/40 p-3">
            <span className="text-[9px] font-semibold text-foreground">{x[0]}</span>
            <span className="text-right text-[8px] text-muted-foreground">{x[1]}</span>
          </div>
        ))}
      </div>
    </ExtraPanel>
    <ExtraPanel title="Agente IA de retención">
      <div className="flex items-center gap-2">
        <span className="size-2 animate-pulse rounded-full bg-secondary" />
        <Badge>Motor activo · 14 casos</Badge>
      </div>
      <p className="mt-3 text-[9px] leading-5 text-muted-foreground">Identifica inasistencias consecutivas y prepara mensajes de acompañamiento para estudiantes EBA con barreras laborales o de conectividad.</p>
      <div className="mt-3 rounded-md border border-border p-3">
        <p className="text-[9px] font-semibold text-foreground">Silvia Cárdenas Palomino</p>
        <p className="mt-1 text-[8px] text-muted-foreground">2.° Avanzado · segunda inasistencia no avisada · riesgo alto</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={(): void => onAction('Enviar WhatsApp IA de rescate')} className="rounded bg-primary px-3 py-2 text-[8px] font-semibold text-primary-foreground">
            WhatsApp IA de rescate
          </button>
          <button onClick={(): void => onAction('Derivar a Tutoría Integral')} className="rounded bg-accent px-3 py-2 text-[8px] font-semibold text-foreground">
            Derivar a Tutoría Integral
          </button>
        </div>
      </div>
    </ExtraPanel>
    <ExtraPanel title="Matriz de permanencia y riesgo de deserción">
      <div className="space-y-2">
        {[
          ['Silvia Cárdenas Palomino', '78% · Alto', '2 faltas consecutivas'],
          ['Juan Pérez Huamán', '42% · Medio', 'Actividad reducida en campus'],
          ['Brayan Quispe Sulca', '26% · Bajo', 'Asistencia justificada'],
        ].map((x, i) => (
          <div key={x[0]} className="flex flex-wrap items-center justify-between gap-2 border-b border-border py-2 last:border-0">
            <div>
              <p className="text-[9px] font-semibold text-foreground">{x[0]}</p>
              <p className="text-[8px] text-muted-foreground">{x[2]}</p>
            </div>
            <Badge tone={i === 0 ? 'red' : i === 1 ? 'amber' : 'green'}>{x[1]}</Badge>
            <button onClick={(): void => onAction('WhatsApp de seguimiento')} className="text-primary">
              <MessageCircle className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
      <button onClick={(): void => onAction('Descargar reporte DRE Ayacucho')} className="mt-3 text-[9px] font-semibold text-primary">
        <Download className="mr-1 inline size-3" />
        Reporte DRE Ayacucho
      </button>
    </ExtraPanel>
    <ExtraPanel title="Expediente de asistencia EBA">
      <p className="text-[9px] text-muted-foreground">Juan Pérez Huamán · Ciclo Avanzado · 2.° Grado B</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {[
          ['Asistencia acumulada', '96.4%'],
          ['Sesiones registradas', '27 / 28'],
          ['Tardanzas', '2'],
          ['Justificaciones', '1 aprobada'],
        ].map((x) => (
          <div key={x[0]} className="rounded bg-accent/40 p-2">
            <p className="text-[8px] text-muted-foreground">{x[0]}</p>
            <p className="mt-1 text-[10px] font-bold text-foreground">{x[1]}</p>
          </div>
        ))}
      </div>
      <button onClick={(): void => onAction('Emitir constancia de asistencia')} className="mt-3 w-full rounded-md border border-border px-3 py-2 text-[9px] font-semibold text-foreground">
        Emitir constancia · Descargar ficha
      </button>
    </ExtraPanel>
  </div>
);

export { AttendanceReferencePanels };
