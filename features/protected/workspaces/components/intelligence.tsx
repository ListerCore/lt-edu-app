'use client';

import type { JSX } from 'react';
import { Activity, AudioLines, BookOpen, Users } from 'lucide-react';
import { Badge, ExtraPanel } from './workspace-reference-ui';

const IntelligenceReferencePanels = ({ onAction }: { onAction: (value: string) => void }): JSX.Element => (
  <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(18rem,.8fr)]">
    <ExtraPanel title="Asistente docente para sesiones y materiales">
      <div className="grid gap-2 sm:grid-cols-3">
        {[
          ['Guía de autoaprendizaje', 'Cuadernillo PDF de cuatro páginas'],
          ['Resumen en audio / podcast', 'Script de cinco minutos'],
          ['Caso de estudio para foro', 'Dilema comunitario síncrono'],
        ].map((r) => (
          <button key={r[0]} onClick={(): void => onAction(r[0])} className="rounded-md bg-accent/50 p-3 text-left">
            <BookOpen className="size-4 text-primary" />
            <p className="mt-2 text-[9px] font-bold text-foreground">{r[0]}</p>
            <p className="mt-1 text-[8px] text-muted-foreground">{r[1]}</p>
          </button>
        ))}
      </div>
      <article className="mt-3 rounded-md border border-border p-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Badge tone="green">Sesión didáctica generada</Badge>
            <h3 className="mt-2 text-[10px] font-bold text-foreground">Sesión N.° 7: Ecuaciones lineales aplicadas a microempresas</h3>
          </div>
          <span className="text-[8px] text-muted-foreground">90 min</span>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {[
            ['Inicio · 15 min', 'Activación de saberes previos'],
            ['Desarrollo · 55 min', 'Modelado y resolución colaborativa'],
            ['Cierre · 20 min', 'Ticket de salida digital'],
          ].map((r) => (
            <div key={r[0]} className="rounded bg-accent/40 p-2">
              <b className="text-[8px] text-foreground">{r[0]}</b>
              <p className="mt-1 text-[8px] text-muted-foreground">{r[1]}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <button onClick={(): void => onAction('Descargar Word')} className="rounded bg-accent px-3 py-2 text-[8px] font-semibold text-foreground">
            Descargar Word (.docx)
          </button>
          <button onClick={(): void => onAction('Descargar PDF oficial')} className="rounded bg-primary px-3 py-2 text-[8px] font-semibold text-primary-foreground">
            Descargar PDF oficial
          </button>
        </div>
      </article>
    </ExtraPanel>
    <div className="flex flex-col gap-4">
      <ExtraPanel title="Tutor inteligente · estudiante">
        <div className="flex items-center justify-between">
          <p className="text-[9px] font-semibold text-foreground">Silvia Cárdenas Palomino</p>
          <button onClick={(): void => onAction('Cambiar estudiante')} className="text-[8px] text-primary">
            Cambiar estudiante
          </button>
        </div>
        <div className="mt-3 space-y-2">
          <p className="rounded-md bg-accent/40 p-3 text-[8px] leading-4 text-muted-foreground">Tengo turno nocturno y no entiendo cómo simplificar fracciones para calcular metros de tela.</p>
          <p className="rounded-md bg-primary p-3 text-[8px] leading-4 text-primary-foreground">Usemos un ejemplo del taller: si necesitas 3/4 de metro por prenda y elaboras 12 prendas, calculamos 12 × 3/4 juntos.</p>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {(
            [
              ['Audio quechua / español', AudioLines],
              ['Sugerir ejercicio práctico', Activity],
              ['Derivar a tutor humano', Users],
            ] as [string, typeof AudioLines][]
          ).map(([x, Icon]) => (
            <button key={x} onClick={(): void => onAction(x)} className="inline-flex items-center gap-1 rounded bg-accent px-2 py-2 text-[8px] font-semibold text-foreground">
              <Icon className="size-3" />
              {x}
            </button>
          ))}
        </div>
      </ExtraPanel>
      <ExtraPanel title="Controles del modelo y salvaguardas">
        <div className="space-y-2">
          {(
            [
              ['Contextualizar al entorno laboral de Huamanga', true],
              ['Incluir enfoque intercultural EBA', true],
              ['Solicitar revisión docente antes de publicar', true],
            ] as [string, boolean][]
          ).map(([label, checked]) => (
            <label key={label} className="flex items-center gap-2 text-[8px] text-foreground">
              <input type="checkbox" defaultChecked={checked} className="accent-primary" />
              {label}
            </label>
          ))}
        </div>
      </ExtraPanel>
    </div>
  </div>
);

export { IntelligenceReferencePanels };
