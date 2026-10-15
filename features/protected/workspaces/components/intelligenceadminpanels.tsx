'use client';

import type { JSX } from 'react';
import { CircleAlert, Download } from 'lucide-react';
import { ExtraPanel } from './workspace-reference-ui';

const IntelligenceAdminPanels = ({ onAction }: { onAction: (value: string) => void }): JSX.Element => (
  <div className="grid gap-4 xl:grid-cols-2">
    <ExtraPanel title="Ajustes del modelo y tokens">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-[9px] font-semibold text-muted-foreground">
          Modelo activo
          <select className="mt-1 h-9 w-full rounded-md border border-border bg-background px-2 text-[9px] text-foreground">
            <option>Llama-3-Edu PE · CNEB</option>
            <option>Modelo institucional alternativo</option>
          </select>
        </label>
        <label className="text-[9px] font-semibold text-muted-foreground">
          Límite de respuesta
          <input defaultValue="2,048 tokens" className="mt-1 h-9 w-full rounded-md border border-border bg-background px-2 text-[9px] text-foreground" />
        </label>
        <label className="text-[9px] font-semibold text-muted-foreground">
          Temperatura
          <input type="range" min="0" max="100" defaultValue="35" className="mt-2 block w-full accent-primary" />
        </label>
        <label className="text-[9px] font-semibold text-muted-foreground">
          Contexto máximo
          <input defaultValue="8,192 tokens" className="mt-1 h-9 w-full rounded-md border border-border bg-background px-2 text-[9px] text-foreground" />
        </label>
      </div>
      <p className="mt-3 rounded-md bg-accent/40 p-3 text-[8px] leading-4 text-muted-foreground">Las salidas generadas para evaluación, promoción o permanencia requieren validación de un responsable institucional.</p>
      <button onClick={(): void => onAction('Guardar ajustes del modelo')} className="mt-3 rounded-md bg-primary px-3 py-2 text-[9px] font-semibold text-primary-foreground">
        Guardar ajustes del modelo
      </button>
    </ExtraPanel>
    <ExtraPanel title="Historial de prompts guardados">
      <div className="space-y-2">
        {[
          ['Rúbrica de fracciones · Matemática funcional', 'Docente · 14 oct. · 4.8/5'],
          ['Guía laboral de costos textiles', 'Material didáctico · 13 oct. · 4.6/5'],
          ['Mensaje de retención con enfoque intercultural', 'Tutoría · 11 oct. · 4.9/5'],
        ].map((r) => (
          <div key={r[0]} className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-accent/40 p-3">
            <div>
              <p className="text-[9px] font-semibold text-foreground">{r[0]}</p>
              <p className="mt-1 text-[8px] text-muted-foreground">{r[1]}</p>
            </div>
            <button onClick={(): void => onAction(`Abrir prompt: ${r[0]}`)} className="text-[8px] font-semibold text-primary">
              Abrir
            </button>
          </div>
        ))}
      </div>
    </ExtraPanel>
    <div className="xl:col-span-2">
      <ExtraPanel title="Matriz predictiva para dirección y tutoría">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CircleAlert className="size-4 text-destructive" />
            <p className="text-[9px] text-muted-foreground">Factores ponderados: inasistencia, pagos, inactividad LMS y caída del rendimiento.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={(): void => onAction('Activar modo offline')} className="rounded-md border border-border px-3 py-2 text-[8px] font-semibold text-foreground">
              Activar modo offline
            </button>
            <button onClick={(): void => onAction('Exportar matriz predictiva')} className="rounded-md bg-primary px-3 py-2 text-[8px] font-semibold text-primary-foreground">
              <Download className="mr-1 inline size-3" />
              Exportar matriz predictiva
            </button>
          </div>
        </div>
      </ExtraPanel>
    </div>
  </div>
);

export { IntelligenceAdminPanels };
