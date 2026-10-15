'use client';

import type { JSX } from 'react';
import { useState } from 'react';
import { CheckCircle2, Download, ExternalLink, MessageCircle, Upload } from 'lucide-react';
import { ExtraPanel, Tabs } from './workspace-reference-ui';

const EnrollmentReferencePanels = ({ onAction }: { onAction: (value: string) => void }): JSX.Element => {
  const [tab, setTab] = useState('Padrón de estudiantes y matrículas');
  return (
    <div className="flex flex-col gap-4">
      <Tabs items={['Padrón de estudiantes y matrículas', 'Expediente digital y carga documental', 'Evaluaciones de ubicación pendientes', 'Nóminas SIAGIE y actas oficiales']} selected={tab} onSelect={setTab} />
      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(18rem,.8fr)]">
        <ExtraPanel title="Juan Pérez Huamán · Expediente digital normado">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold text-foreground">DNI 47829103 · Nacimiento 12/04/2002 · 24 años</p>
              <p className="mt-1 text-[9px] text-muted-foreground">Ciclo Avanzado · 2.° Grado Modular · 100% virtual asíncrono</p>
            </div>
            <span className="rounded-full bg-secondary/10 px-2 py-1 text-[8px] font-semibold text-secondary">Matrícula activa</span>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {[
              ['Copia DNI vigente (frente / reverso)', 'Validado en RENIEC'],
              ['Certificado oficial de estudios EBR', 'Visado por UGEL Huamanga'],
              ['Ficha Única de Matrícula (FUM)', 'Firma digital Director General'],
              ['Acta de evaluación de ubicación', 'Calificación 16.5 · RVM 034-2019'],
            ].map((x) => (
              <div key={x[0]} className="flex min-w-0 items-center gap-2 rounded-md bg-accent/40 p-2.5">
                <CheckCircle2 className="size-3.5 shrink-0 text-secondary" />
                <div className="min-w-0">
                  <p className="truncate text-[9px] font-semibold text-foreground">{x[0]}</p>
                  <p className="mt-1 text-[8px] text-muted-foreground">{x[1]}</p>
                </div>
                <button onClick={(): void => onAction('Visualizar documento')} className="ml-auto text-primary">
                  <ExternalLink className="size-3" />
                </button>
              </div>
            ))}
          </div>
          <button onClick={(): void => onAction('Subir documento al expediente')} className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-border bg-background p-3 text-[9px] font-semibold text-muted-foreground hover:bg-muted">
            <Upload className="size-3.5" />
            Subir o arrastrar nuevo documento · PDF, JPG, PNG hasta 15 MB
          </button>
          <div className="mt-4 border-t border-border pt-3">
            <h3 className="text-[10px] font-bold text-foreground">Trayectoria académica del estudiante</h3>
            <div className="mt-3 space-y-3 border-l border-border pl-4 text-[9px] text-muted-foreground">
              <p>
                <b className="text-secondary">2022 · Ayacucho</b>
                <br />
                Interrupción de estudios en 2.° de secundaria EBR.
              </p>
              <p>
                <b className="text-primary">Julio 2026 · SIGE-JL</b>
                <br />
                Preinscripción virtual y solicitud de convalidación EBA.
              </p>
              <p>
                <b className="text-secondary">05 agosto 2026</b>
                <br />
                Evaluación de ubicación aprobada: 16.5 (A).
              </p>
              <p>
                <b className="text-primary">18 agosto 2026 · Actual</b>
                <br />
                Matrícula confirmada y visada en nómina SIAGIE 2026-II.
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={(): void => onAction('Descargar FUM')} className="flex-1 rounded-md bg-primary px-3 py-2.5 text-[9px] font-semibold text-primary-foreground">
              <Download className="mr-1 inline size-3" />
              Descargar Ficha Única de Matrícula (FUM)
            </button>
            <button onClick={(): void => onAction('Enviar WhatsApp / SMS')} className="rounded-md bg-accent px-3 py-2.5 text-[9px] font-semibold text-foreground">
              <MessageCircle className="mr-1 inline size-3" />
              WhatsApp / SMS
            </button>
          </div>
        </ExtraPanel>
        <div className="flex flex-col gap-4">
          <ExtraPanel title="Evaluación de ubicación">
            <p className="text-[9px] leading-5 text-muted-foreground">Asistente de convalidación curricular automática compara certificados EBR/EBA y recomienda la ubicación modular según el CNEB.</p>
            <button onClick={(): void => onAction('Escanear certificado con IA')} className="mt-3 w-full rounded-md bg-primary px-3 py-2.5 text-[9px] font-semibold text-primary-foreground">
              Escanear certificado con IA
            </button>
          </ExtraPanel>
          <ExtraPanel title="Nuevo registro de matrícula EBA 2026-II">
            <div className="grid gap-2">
              {[
                ['Tipo de documento', 'DNI'],
                ['Número de documento', '8 dígitos'],
                ['Nombres y apellidos', 'Consulta RENIEC'],
                ['Ciclo postulado', 'Seleccionar ciclo'],
                ['Modalidad de atención', 'Virtual / semipresencial'],
              ].map((x) => (
                <label key={x[0]} className="text-[8px] font-semibold text-muted-foreground">
                  {x[0]}
                  <input placeholder={x[1]} className="mt-1 h-8 w-full rounded border border-border bg-background px-2 text-[9px] text-foreground" />
                </label>
              ))}
            </div>
            <button onClick={(): void => onAction('Registrar matrícula y generar carpeta')} className="mt-3 w-full rounded-md bg-primary px-3 py-2.5 text-[9px] font-semibold text-primary-foreground">
              Registrar y generar carpeta
            </button>
          </ExtraPanel>
        </div>
      </div>
    </div>
  );
};

export { EnrollmentReferencePanels };
