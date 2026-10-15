'use client';

import type { JSX } from 'react';
import { useState } from 'react';
import { ArrowRight, CalendarDays, ExternalLink } from 'lucide-react';
import { Badge, ExtraPanel, Tabs } from './workspace-reference-ui';

const ClassroomReferencePanels = ({ onAction }: { onAction: (value: string) => void }): JSX.Element => {
  const [tab, setTab] = useState('Plan de aprendizaje');
  return (
    <div className="flex flex-col gap-4">
      <Tabs items={['Plan de aprendizaje', 'Tareas y entregables · 5', 'Evaluaciones en línea · 3', 'Foros colaborativos · 2', 'Biblioteca digital']} selected={tab} onSelect={setTab} />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(17rem,.75fr)]">
        <ExtraPanel title="Contenido de la unidad didáctica">
          <div className="grid gap-3 sm:grid-cols-2">
            <article className="rounded-md bg-accent/40 p-3">
              <div className="flex items-center justify-between">
                <Badge tone="green">Foro 2</Badge>
                <span className="text-[8px] text-muted-foreground">24 aportes</span>
              </div>
              <h3 className="mt-2 text-[10px] font-bold text-foreground">¿Cómo aplicas el cálculo fraccionario a tu actividad laboral o comercio familiar?</h3>
              <p className="mt-2 text-[8px] leading-4 text-muted-foreground">Comparte un ejemplo de compra de insumos, confección, transporte o venta diaria.</p>
              <button onClick={(): void => onAction('Participar en foro')} className="mt-3 text-[9px] font-semibold text-primary">
                Participar en el foro <ArrowRight className="ml-1 inline size-3" />
              </button>
            </article>
            <article className="rounded-md bg-accent/40 p-3">
              <Badge>Entrega · 25 oct.</Badge>
              <h3 className="mt-2 text-[10px] font-bold text-foreground">Evidencia 06: Hoja de presupuesto fraccionario para microempresa</h3>
              <p className="mt-2 text-[8px] leading-4 text-muted-foreground">23 de 28 entregadas · 5 pendientes · 18 calificadas.</p>
              <div className="mt-3 flex gap-2">
                <button onClick={(): void => onAction('Ver rúbrica MINEDU')} className="rounded bg-card px-2 py-1.5 text-[8px] font-semibold text-foreground">
                  Ver rúbrica
                </button>
                <button onClick={(): void => onAction('Calificar entregas')} className="rounded bg-secondary px-2 py-1.5 text-[8px] font-semibold text-secondary-foreground">
                  Calificar entregas (5)
                </button>
              </div>
            </article>
          </div>
          <div className="mt-4 border-t border-border pt-3">
            <h3 className="text-[10px] font-bold text-foreground">Otras sesiones de la Unidad Didáctica 2</h3>
            <div className="mt-2 space-y-2">
              {[
                ['05', 'Concepto y representación de fracciones', 'Finalizada · 28/28 evaluados', 'Completada'],
                ['07', 'Operaciones con decimales y cálculo de IGV', 'Programada para el 30 de octubre', 'Borrador docente'],
              ].map((r) => (
                <div key={r[0]} className="flex flex-wrap items-center gap-3 rounded bg-accent/40 p-2">
                  <Badge>{r[0]}</Badge>
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] font-semibold text-foreground">{r[1]}</p>
                    <p className="text-[8px] text-muted-foreground">{r[2]}</p>
                  </div>
                  <Badge tone={r[3] === 'Completada' ? 'green' : 'blue'}>{r[3]}</Badge>
                </div>
              ))}
            </div>
          </div>
        </ExtraPanel>
        <div className="flex flex-col gap-4">
          <ExtraPanel title="Mi progreso en Matemática">
            <p className="font-heading text-2xl font-bold text-foreground">
              68% <span className="text-[10px] font-normal text-muted-foreground">completado</span>
            </p>
            <div className="mt-2 h-2 rounded-full bg-muted">
              <div className="h-full w-[68%] rounded-full bg-secondary" />
            </div>
            <button onClick={(): void => onAction('Ver libreta de calificaciones y rúbricas')} className="mt-3 text-[9px] font-semibold text-primary">
              Ver libreta de calificaciones y rúbricas <ArrowRight className="ml-1 inline size-3" />
            </button>
          </ExtraPanel>
          <ExtraPanel title="Próximos vencimientos">
            <div className="space-y-2">
              {[
                ['25 oct.', 'Hoja de presupuesto fraccionario'],
                ['27 oct.', 'Autoevaluación formativa'],
                ['30 oct.', 'Foro de aprendizaje colaborativo'],
              ].map((r) => (
                <div key={r[0]} className="flex items-center gap-2 rounded bg-accent/40 p-2">
                  <CalendarDays className="size-3.5 text-primary" />
                  <span className="text-[8px] font-bold text-foreground">{r[0]}</span>
                  <span className="text-[8px] text-muted-foreground">{r[1]}</span>
                </div>
              ))}
            </div>
          </ExtraPanel>
          <ExtraPanel title="Biblioteca y autoaprendizaje">
            <div className="space-y-2">
              {['Khan Academy EBA en Español', 'Repositorio Digital PERUEDUCA MINEDU', 'Simulador GeoGebra: fracciones y recta'].map((x) => (
                <button key={x} onClick={(): void => onAction(x)} className="flex w-full items-center justify-between rounded bg-accent/40 p-2 text-left text-[8px] text-foreground">
                  {x}
                  <ExternalLink className="size-3 text-primary" />
                </button>
              ))}
            </div>
          </ExtraPanel>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <ExtraPanel title="Vista del estudiante · progreso y calendario">
          <p className="text-[9px] leading-5 text-muted-foreground">Cambiar a la experiencia de estudiante para consultar calendario, tareas y avance personal.</p>
          <button onClick={(): void => onAction('Cambiar a vista estudiante')} className="mt-3 rounded-md bg-primary px-3 py-2 text-[9px] font-semibold text-primary-foreground">
            Vista estudiante
          </button>
        </ExtraPanel>
        <ExtraPanel title="Foro y actividad colaborativa">
          <p className="text-[9px] leading-5 text-muted-foreground">Foro 2: cálculo fraccionario aplicado al trabajo. 24 aportes de compañeros · última actividad hoy.</p>
          <button onClick={(): void => onAction('Abrir foro colaborativo')} className="mt-3 rounded-md border border-border px-3 py-2 text-[9px] font-semibold text-foreground">
            Abrir foro
          </button>
        </ExtraPanel>
      </div>
    </div>
  );
};

export { ClassroomReferencePanels };
