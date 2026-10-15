'use client';

import type { JSX } from 'react';
import { useState } from 'react';
import { Bot, FileCheck2, Search } from 'lucide-react';
import { EnrollmentReferencePanels } from './workspace-reference-panels';
import { Badge, Section, useWorkspaceNotice, WorkspaceShell } from './workspace-ui';

const EnrollmentScreen = (): JSX.Element => {
  const { notify, notice } = useWorkspaceNotice();
  const [query, setQuery] = useState('');
  return (
    <WorkspaceShell eyebrow={'GESTIÓN ACADÉMICA · RVM N.° 125-2020-MINEDU'} title={'Gestión de Matrícula y Expediente Digital EBA'} description={'Flujo oficial de convalidación, evaluación de ubicación y registro modular para Educación Básica Alternativa.'} actions={['FUM masiva (lote)', 'Nómina oficial SIAGIE', 'Nueva matrícula EBA']} onAction={notify} notice={notice}>
      {
        <>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="green">SIAGIE MINEDU · Conectado y validado</Badge>
            <Badge>Resolución DREA N.° 0451-2024-ED</Badge>
            <Badge tone="green">Periodo 2026-II activo</Badge>
          </div>
          <Section title="Ruta integral del postulante EBA" subtitle="RVM N.° 125-2020-MINEDU · Sincronización en tiempo real con DRE Ayacucho">
            <div className="grid gap-2 p-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ['PASO 01', 'Preinscripción y registro', 'Validación DNI/RENIEC, ficha socioeconómica y perfil laboral del adulto.', '100% completado · 452 postulantes'],
                ['PASO 02', 'Evaluación / Convalidación', 'Prueba diagnóstica o tabla de convalidación EBR a EBA.', 'Homologado DREA · 14 pendientes'],
                ['PASO 03', 'Asignación ciclo / grado', 'Inicial (1.º–2.º), Intermedio (1.º–3.º) o Avanzado (1.º–4.º grado modular).', 'Equivalencia aprobada'],
                ['PASO 04 · CLAVE', 'Matrícula y emisión FUM', 'Generación de código modular, visado digital y emisión FUM oficial.', '398 matrículas activas'],
              ].map(([step, title, detail, state], i) => (
                <article key={step} className={`rounded-md border p-3 ${i === 3 ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-accent/40'}`}>
                  <p className={`text-[8px] font-bold tracking-wider ${i === 3 ? 'text-primary-foreground/70' : 'text-primary'}`}>{step}</p>
                  <h3 className="mt-2 text-[11px] font-bold">{title}</h3>
                  <p className={`mt-1.5 min-h-10 text-[9px] leading-4 ${i === 3 ? 'text-primary-foreground/75' : 'text-muted-foreground'}`}>{detail}</p>
                  <p className="mt-2 text-[8px] font-semibold">● {state}</p>
                </article>
              ))}
            </div>
          </Section>
          <Section title="Padrón de estudiantes y matrículas" subtitle="Expediente EBA · periodo vigente">
            <div className="flex flex-col gap-2 border-b border-border p-3 sm:flex-row">
              <label className="relative min-w-0 flex-1">
                <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <input value={query} onChange={(e): void => setQuery(e.target.value)} placeholder="Buscar por DNI, nombres o código modular" className="h-9 w-full rounded-md border border-border bg-background pl-8 pr-2 text-[10px] text-foreground outline-none" />
              </label>
              <select className="h-9 rounded-md border border-border bg-background px-2 text-[10px] text-foreground">
                <option>Todos los ciclos</option>
                <option>Inicial</option>
                <option>Intermedio</option>
                <option>Avanzado</option>
              </select>
              <select className="h-9 rounded-md border border-border bg-background px-2 text-[10px] text-foreground">
                <option>Todos los estados</option>
                <option>Matriculado</option>
                <option>En ubicación</option>
                <option>Observado</option>
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-190 text-left text-[9px]">
                <thead className="bg-accent/60 text-[8px] uppercase tracking-wide text-muted-foreground">
                  <tr>
                    {['Estudiante / DNI / origen', 'Ciclo y grado', 'Antecedente EBR/EBA', 'Expediente digital', 'Estado matrícula', 'Acciones'].map((x) => (
                      <th key={x} className="px-3 py-3 font-semibold">
                        {x}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    ['Juan Pérez Huamán', '47829103 · Ayacucho', 'Avanzado · 2.° grado modular', '4/4 completos · 100%', 'Matriculado'],
                    ['Roxana Quispe Sulca', '71203948 · Huanta', 'Avanzado · 4.° grado', '4/4 completos · 100%', 'Matriculado'],
                    ['Edwin Mendoza Alarcón', '42918274 · Cangallo', 'Intermedio · 3.° grado propuesto', '2/4 en revisión · 50%', 'En ubicación'],
                    ['Silvia Cárdenas Palomino', '74819203 · Ayacucho', 'Avanzado · 1.° grado', '1/4 incompleto · 25%', 'Observado'],
                  ]
                    .filter((row) => row.join(' ').toLowerCase().includes(query.toLowerCase()))
                    .map((r, i) => (
                      <tr key={r[1]}>
                        <td className="px-3 py-3">
                          <b className="text-foreground">{r[0]}</b>
                          <p className="mt-1 text-muted-foreground">DNI: {r[1]}</p>
                        </td>
                        <td className="px-3 py-3 text-foreground">{r[2]}</td>
                        <td className="px-3 py-3 text-muted-foreground">{i === 0 ? '2.° Sec. EBR incompleta' : 'Certificado validado'}</td>
                        <td className="px-3 py-3 text-foreground">{r[3]}</td>
                        <td className="px-3 py-3">
                          <Badge tone={r[4] === 'Matriculado' ? 'green' : r[4] === 'Observado' ? 'red' : 'amber'}>{r[4]}</Badge>
                        </td>
                        <td className="px-3 py-3">
                          <button onClick={(): void => notify('Abrir expediente')} className="text-primary">
                            Ver · Descargar
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </Section>
          <div className="grid gap-4 xl:grid-cols-[1fr_1.45fr]">
            <Section title="Asistente de convalidación curricular automática">
              <div className="flex items-start gap-3 p-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-md bg-accent text-primary">
                  <Bot className="size-4" />
                </span>
                <div>
                  <p className="text-[10px] leading-5 text-muted-foreground">Analiza certificados EBR y programas PRONOE/EBA para sugerir ubicación según matrices CNEB y directivas vigentes.</p>
                  <button onClick={(): void => notify('Escanear certificado con IA')} className="mt-3 rounded-md bg-primary px-3 py-2 text-[9px] font-semibold text-primary-foreground">
                    Escanear certificado con IA
                  </button>
                </div>
              </div>
            </Section>
            <Section title="Expediente digital · Juan Pérez Huamán">
              <div className="grid gap-2 p-4 sm:grid-cols-2">
                {['Copia DNI vigente · RENIEC validado', 'Certificado oficial de estudios EBR', 'Ficha Única de Matrícula (FUM)', 'Acta de evaluación de ubicación'].map((x) => (
                  <div key={x} className="flex items-center gap-2 rounded-md bg-accent/40 p-2.5 text-[9px] text-foreground">
                    <FileCheck2 className="size-3.5 text-secondary" />
                    {x}
                  </div>
                ))}
              </div>
            </Section>
          </div>
          <EnrollmentReferencePanels onAction={notify} />
        </>
      }
    </WorkspaceShell>
  );
};

export { EnrollmentScreen };
