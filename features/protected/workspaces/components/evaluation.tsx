'use client';

import type { JSX } from 'react';
import { useState } from 'react';
import { Badge, ExtraPanel, Tabs } from './workspace-reference-ui';

const EvaluationReferencePanels = ({ onAction }: { onAction: (value: string) => void }): JSX.Element => {
  const [tab, setTab] = useState('Registro auxiliar por competencias');
  return (
    <div className="flex flex-col gap-4">
      <Tabs items={['Registro auxiliar por competencias', 'Matriz de capacidades y criterios', 'Consolidado bimestral', 'Libreta oficial EBA']} selected={tab} onSelect={setTab} />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(18rem,.8fr)]">
        <ExtraPanel title="Criterios de valoración formativa · Ciclo Avanzado">
          <div className="grid gap-2 sm:grid-cols-4">
            {[
              ['AD', 'Logro destacado', 'Formula modelos algebraicos y aplica optimización.', 'green'],
              ['A', 'Logro esperado', 'Calcula costo total y precio unitario.', 'blue'],
              ['B', 'En proceso', 'Identifica costos y requiere guía.', 'amber'],
              ['C', 'En inicio', 'Resuelve cantidades directas con dificultad.', 'red'],
            ].map((r) => (
              <article key={r[0]} className="rounded-md bg-accent/40 p-3">
                <Badge tone={r[3] as 'green' | 'blue' | 'amber' | 'red'}>{r[0]}</Badge>
                <h3 className="mt-2 text-[9px] font-bold text-foreground">{r[1]}</h3>
                <p className="mt-1 text-[8px] leading-4 text-muted-foreground">{r[2]}</p>
              </article>
            ))}
          </div>
          <div className="mt-4 border-t border-border pt-3">
            <h3 className="text-[10px] font-bold text-foreground">Matriz de capacidades y criterios</h3>
            <div className="mt-2 overflow-x-auto">
              <table className="w-full min-w-130 text-left text-[8px]">
                <thead className="bg-accent/50 text-muted-foreground">
                  <tr>
                    {['Capacidad', 'Criterio de evaluación', 'Evidencia', 'Ponderación'].map((x) => (
                      <th key={x} className="p-2">
                        {x}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    ['Traduce cantidades', 'Representa relaciones entre cantidades', 'Informe de presupuesto', '30%'],
                    ['Comunica comprensión', 'Explica procedimientos con fracciones', 'Sustentación oral', '25%'],
                    ['Usa estrategias', 'Selecciona cálculo y estimación adecuados', 'Hoja de costos', '25%'],
                    ['Argumenta afirmaciones', 'Valida resultados en contexto real', 'Caso aplicado', '20%'],
                  ].map((r) => (
                    <tr key={r[0]}>
                      {r.map((v) => (
                        <td key={v} className="p-2 text-foreground">
                          {v}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ExtraPanel>
        <div className="flex flex-col gap-4">
          <ExtraPanel title="Desempeño por áreas · Juan Pérez Huamán">
            <p className="text-[9px] text-muted-foreground">Matemática funcional · Ciclo Avanzado</p>
            <div className="mt-3 space-y-2">
              {[
                ['Matemática funcional', 'A', '88%'],
                ['Comunicación', 'AD', '94%'],
                ['Ciencia y tecnología', 'A', '82%'],
                ['Desarrollo personal', 'B', '68%'],
              ].map((r) => (
                <div key={r[0]}>
                  <div className="flex justify-between text-[8px]">
                    <span className="text-foreground">{r[0]}</span>
                    <span className="font-semibold text-primary">
                      {r[1]} · {r[2]}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: r[2] }} />
                  </div>
                </div>
              ))}
            </div>
          </ExtraPanel>
          <ExtraPanel title="Acompañamiento formativo">
            <p className="text-[9px] leading-5 text-muted-foreground">Dos estudiantes requieren recuperación pedagógica en resolución de problemas de cantidad. Plan tutorial disponible para seguimiento de cuatro semanas.</p>
            <button onClick={(): void => onAction('Generar ficha de recuperación')} className="mt-3 w-full rounded-md bg-accent px-3 py-2 text-[9px] font-semibold text-primary">
              Generar ficha de recuperación
            </button>
          </ExtraPanel>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-4">
        <div>
          <p className="text-[9px] font-semibold text-foreground">Último guardado automático · Hoy 15:42 hrs</p>
          <p className="mt-1 text-[8px] text-muted-foreground">Docente: smorales@cebalister.edu.pe · Vista: {tab}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['Guardar borrador', 'Acta preliminar bimestral', 'Firmar digitalmente y transmitir a SIAGIE'].map((x) => (
            <button key={x} onClick={(): void => onAction(x)} className="rounded-md border border-border px-3 py-2 text-[8px] font-semibold text-foreground hover:bg-muted">
              {x}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export { EvaluationReferencePanels };
