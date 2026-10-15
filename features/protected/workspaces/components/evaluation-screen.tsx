'use client';

import type { JSX } from 'react';
import { EvaluationReferencePanels } from './workspace-reference-panels';
import { useState } from 'react';
import { Check, ClipboardCheck, GraduationCap } from 'lucide-react';
import { Action, Badge, Metric, Section, useWorkspaceNotice, WorkspaceShell } from './workspace-ui';

const EvaluationScreen = (): JSX.Element => {
  const { notify, notice } = useWorkspaceNotice();
  const [query, setQuery] = useState('');
  return (
    <WorkspaceShell eyebrow={'EVALUACIÓN · CNEB / MINEDU R.V.M. 125-2020'} title={'Evaluación de Competencias y Logros de Aprendizaje EBA'} description={'Ciclo Avanzado · 2.° Grado B · Área: Matemática Funcional · Docente: Mag. Sonia Morales Cárdenas · Bimestre I vigente.'} actions={['Exportar SIAGIE (Excel)', 'Boletas EBA (PDF)', 'Publicar y notificar']} onAction={notify} notice={notice}>
      {
        <>
          <div className="flex flex-wrap gap-2">
            {['Registro Auxiliar por Competencias', 'Matriz de Capacidades y Criterios', 'Vista Docente / Calificador', 'Vista Estudiante (Progreso)'].map((x, i) => (
              <button key={x} onClick={(): void => notify(x)} className={`rounded-md px-3 py-2.5 text-[9px] font-semibold ${i === 0 ? 'bg-primary text-primary-foreground' : 'border border-border bg-card text-foreground'}`}>
                {x}
              </button>
            ))}
          </div>
          <div className="grid gap-3 grid-cols-2 xl:grid-cols-5">
            {[
              ['Nivel AD', '7', 'Logro destacado · 25%', 'green'],
              ['Nivel A', '15', 'Logro esperado · 53.6%', 'primary'],
              ['Nivel B', '4', 'En proceso · 14.3%', 'amber'],
              ['Nivel C', '2', 'En inicio · 7.1%', 'red'],
              ['Entregas virtuales', '92.8%', '26/28 evidencias', 'primary'],
            ].map(([a, b, c, t]) => (
              <Metric key={a} label={a} value={b} detail={c} icon={GraduationCap} tone={t as 'primary' | 'green' | 'amber' | 'red'} />
            ))}
          </div>
          <Section title="Resuelve problemas de cantidad" subtitle="Competencia EBA 1 de 4 · Currículo Nacional EBA 2026">
            <div className="flex flex-wrap items-center justify-between gap-3 p-4">
              <p className="max-w-xl text-[10px] leading-5 text-muted-foreground">Evidencia vinculada: “Informe de presupuesto y resolución de problemas con fracciones en actividades agrocomerciales y de servicios de la región Ayacucho”.</p>
              <div className="flex gap-2">
                <select className="h-9 rounded-md border border-border bg-background px-2 text-[9px] text-foreground">
                  <option>Comp. 1: Cantidad</option>
                  <option>Comp. 2: Regularidad</option>
                </select>
                <Action onClick={(): void => notify('Ver criterios y rúbrica')}>
                  <ClipboardCheck className="size-3.5" />
                  Ver rúbrica
                </Action>
              </div>
            </div>
          </Section>
          <Section title="Registro auxiliar de calificaciones" subtitle="28 estudiantes matriculados">
            <div className="flex flex-col gap-2 border-b border-border p-3 sm:flex-row">
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filtrar por nombre o DNI..." className="h-9 min-w-48 flex-1 rounded-md border border-border bg-background px-3 text-[10px] text-foreground" />
              <Badge>Estado: Todos</Badge>
              <Action primary onClick={(): void => notify('Guardar calificaciones')}>
                <Check className="size-3.5" />
                Guardar calificaciones
              </Action>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-212.5 text-left text-[9px]">
                <thead className="bg-accent/60 text-[8px] uppercase text-muted-foreground">
                  <tr>
                    {['Estudiante EBA', 'Evidencia Campus', 'Cap. 1', 'Cap. 2', 'Cap. 3', 'Cap. 4', 'Logro final', 'Retroalimentación formativa'].map((x) => (
                      <th key={x} className="px-3 py-3">
                        {x}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    ['Juan Pérez Huamán', 'Proyecto práctico', 'AD', 'AD', 'A', 'A', 'A', 'Demuestra solvencia al resolver problemas'],
                    ['Roxana Quispe Sulca', 'Proyecto práctico', 'AD', 'AD', 'AD', 'AD', 'AD', 'Excelente rigor matemático'],
                    ['Edwin Mendoza Alarcón', 'Tarea virtual (reentrega)', 'A', 'B', 'B', 'B', 'B', 'Comprende la noción operativa'],
                    ['Silvia Cárdenas Palomino', 'Examen diagnóstico', 'A', 'A', 'A', 'A', 'A', 'Resolución completa con razonamiento'],
                    ['Brayan Quispe Sulca', 'Entrega parcial fuera de plazo', 'C', 'C', 'B', 'C', 'C', 'Plan de refuerzo EBA activado'],
                    ['Esther Palomino Soto', 'Proyecto práctico', 'A', 'AD', 'A', 'A', 'A', 'Buen desempeño en estimación'],
                  ]
                    .filter((r) => r.join(' ').toLowerCase().includes(query.toLowerCase()))
                    .map((r) => (
                      <tr key={r[0]}>
                        <td className="px-3 py-3 font-semibold text-foreground">{r[0]}</td>
                        <td className="px-3 py-3 text-muted-foreground">{r[1]}</td>
                        {r.slice(2, 7).map((v, i) => (
                          <td key={i} className="px-2 py-3">
                            <select defaultValue={v} aria-label={`${r[0]} criterio ${i + 1}`} className={`rounded px-2 py-1.5 font-semibold ${v === 'AD' ? 'bg-secondary/20 text-secondary' : v === 'A' ? 'bg-accent text-primary' : v === 'B' ? 'bg-chart-3/20 text-chart-3' : 'bg-destructive/10 text-destructive'}`}>
                              <option>AD</option>
                              <option>A</option>
                              <option>B</option>
                              <option>C</option>
                            </select>
                          </td>
                        ))}
                        <td className="px-3 py-3">
                          <Badge tone={r[6] === 'AD' ? 'green' : r[6] === 'C' ? 'red' : 'blue'}>{r[6]}</Badge>
                        </td>
                        <td className="max-w-56 px-3 py-3 text-muted-foreground">{r[7]}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <p className="border-t border-border px-4 py-3 text-[9px] text-muted-foreground">Guardado automático de borradores activado · Escala oficial EBA: AD, A, B, C.</p>
          </Section>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-accent/40 p-4">
            <div>
              <h3 className="text-[10px] font-bold text-foreground">Normativa de promoción y recuperación pedagógica EBA</h3>
              <p className="mt-1 text-[9px] text-muted-foreground">Estudiantes con nivel C acceden a recuperación con acompañamiento tutorial.</p>
            </div>
            <Action primary onClick={(): void => notify('Firmar digitalmente y transmitir a SIAGIE')}>
              Firmar y transmitir a SIAGIE
            </Action>
          </div>
          <EvaluationReferencePanels onAction={notify} />
        </>
      }
    </WorkspaceShell>
  );
};

export { EvaluationScreen };
